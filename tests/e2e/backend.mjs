// Backend integration test: payments webhook, member sign-in, account, course access and
// gated downloads, run against the real production build with a mock Supabase server.
//
//   npm run build && node tests/e2e/backend.mjs
//
// It starts: a mock Supabase (port 3399: auth, PostgREST and storage endpoints, in memory)
// and `next start` on port 3398 with test keys. Both are stopped at the end.
// Optional env: CHROME_PATH.
import { spawn } from 'node:child_process';
import { createHmac } from 'node:crypto';
import http from 'node:http';
import puppeteer from 'puppeteer-core';

const APP = 'http://localhost:3398';
const MOCK_PORT = 3399;
const SECRET = 'whsec_test_secret';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const MEMBER = { id: '00000000-0000-4000-8000-000000000001', email: 'member@example.com' };
const TOKEN = 'test-access-token';

/* ---------------- mock Supabase ---------------- */
const db = []; // entitlements rows
const log = []; // every request
const mock = http.createServer(async (req, res) => {
  let body = '';
  for await (const c of req) body += c;
  const url = new URL(req.url, `http://localhost:${MOCK_PORT}`);
  log.push({ method: req.method, path: url.pathname, search: url.search, body, auth: req.headers.authorization });
  const json = (code, data) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(data === undefined ? '' : JSON.stringify(data)); };

  if (url.pathname === '/auth/v1/otp' && req.method === 'POST') return json(200, {});
  if (url.pathname === '/auth/v1/user') {
    return req.headers.authorization === `Bearer ${TOKEN}`
      ? json(200, { id: MEMBER.id, aud: 'authenticated', role: 'authenticated', email: MEMBER.email, app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() })
      : json(401, { message: 'invalid token' });
  }
  if (url.pathname === '/rest/v1/entitlements') {
    if (req.method === 'POST') {
      for (const row of [].concat(JSON.parse(body))) {
        const i = db.findIndex((r) => r.source_id === row.source_id);
        if (i >= 0) db[i] = { ...db[i], ...row }; else db.push(row);
      }
      return json(201);
    }
    if (req.method === 'PATCH') {
      const like = (url.searchParams.get('source_id') || '').replace(/^like\./, '').replace(/%$/, '').replace(/\*$/, '');
      const patch = JSON.parse(body);
      db.forEach((r) => { if (r.source_id.startsWith(like)) Object.assign(r, patch); });
      return json(204);
    }
    if (req.method === 'GET') {
      const email = (url.searchParams.get('email') || '').replace(/^eq\./, '');
      return json(200, db.filter((r) => r.email === email));
    }
  }
  if (url.pathname.startsWith('/storage/v1/object/sign/')) {
    const path = url.pathname.slice('/storage/v1'.length);
    return json(200, { signedURL: `${path}?token=signed-test-token` });
  }
  json(404, { message: 'not mocked' });
});

/* ---------------- helpers ---------------- */
let passed = 0, failed = 0;
const results = [];
async function test(name, fn) {
  try { await fn(); passed++; results.push(`  ✓ ${name}`); }
  catch (e) { failed++; results.push(`  ✗ ${name}\n      ${e.message}`); }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const sign = (body) => createHmac('sha256', SECRET).update(body).digest('hex');
async function webhook(payload, { signature, raw } = {}) {
  const body = raw ?? JSON.stringify(payload);
  const res = await fetch(`${APP}/api/webhooks/lemonsqueezy`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-signature': signature ?? sign(body) }, body });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}
const subEvent = (event, over = {}) => ({
  meta: { event_name: event },
  data: { id: '9001', attributes: { user_email: 'Member@Example.com', variant_id: 111, status: 'active', renews_at: '2099-01-01T00:00:00Z', ends_at: null, customer_id: 55, urls: { customer_portal: 'https://example.lemonsqueezy.com/billing' }, ...over } },
});
const orderEvent = (event, variant, over = {}) => ({
  meta: { event_name: event },
  data: { id: '7001', attributes: { user_email: MEMBER.email, status: 'paid', customer_id: 55, first_order_item: { variant_id: variant }, ...over } },
});
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(url, tries = 80) {
  for (let i = 0; i < tries; i++) { try { await fetch(url); return; } catch { await wait(500); } }
  throw new Error(`server at ${url} did not start`);
}
function sessionCookie() {
  const session = { access_token: TOKEN, refresh_token: 'refresh', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: MEMBER.id, email: MEMBER.email, aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} } };
  return { name: 'sb-localhost-auth-token', value: 'base64-' + Buffer.from(JSON.stringify(session)).toString('base64url'), domain: 'localhost', path: '/' };
}

/* ---------------- run ---------------- */
mock.listen(MOCK_PORT);
const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3398'], {
  env: {
    ...process.env,
    SUPABASE_URL: `http://localhost:${MOCK_PORT}`,
    SUPABASE_ANON_KEY: 'anon-test',
    SUPABASE_SERVICE_ROLE_KEY: 'service-test',
    LEMONSQUEEZY_WEBHOOK_SECRET: SECRET,
    LEMONSQUEEZY_VARIANT_MAP: JSON.stringify({ 111: 'membership:pro', 222: 'course:product-visualization-masterclass', 333: 'addon:batch-render-pro' }),
    TRUSTED_PROXY_HOPS: '1',
  },
  stdio: 'ignore',
});
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, defaultViewport: { width: 1280, height: 900 } });
// Dismiss the cookie banner up front (it sits over the bottom-left of small viewports).
const newPage = async () => { const p = await browser.newPage(); await p.evaluateOnNewDocument(() => localStorage.setItem('bcg-consent', 'essential')); return p; };

try {
  await until(APP);

  /* Payments webhook */
  await test('webhook rejects a bad signature (401)', async () => {
    const r = await webhook(subEvent('subscription_created'), { signature: 'deadbeef' });
    assert(r.status === 401, `got ${r.status}`);
  });
  await test('webhook rejects an oversized body (413)', async () => {
    const big = JSON.stringify({ meta: { event_name: 'x' }, pad: 'a'.repeat(600 * 1024) });
    const r = await webhook(null, { raw: big });
    assert(r.status === 413, `got ${r.status}`);
  });
  await test('subscription_created records a Pro membership (email lower-cased, portal saved)', async () => {
    const r = await webhook(subEvent('subscription_created'));
    assert(r.status === 200 && r.data.action === 'upsert', JSON.stringify(r));
    const row = db.find((x) => x.source_id === 'sub:9001');
    assert(row && row.key === 'membership:pro' && row.status === 'active' && row.email === MEMBER.email && row.portal_url, JSON.stringify(row));
  });
  await test('webhook retries are idempotent (same source_id updates, no duplicate)', async () => {
    await webhook(subEvent('subscription_updated', { status: 'past_due' }));
    assert(db.filter((x) => x.source_id === 'sub:9001').length === 1, 'duplicate rows');
    assert(db.find((x) => x.source_id === 'sub:9001').status === 'past_due', 'status not updated');
    await webhook(subEvent('subscription_updated', { status: 'active' }));
  });
  await test('order_created records a course purchase', async () => {
    const r = await webhook(orderEvent('order_created', 222));
    assert(r.data.action === 'upsert', JSON.stringify(r));
    assert(db.some((x) => x.source_id === 'order:7001:222' && x.key === 'course:product-visualization-masterclass' && x.status === 'paid'), 'row missing');
  });
  await test('order for a subscription variant is ignored (handled by subscription events)', async () => {
    const r = await webhook(orderEvent('order_created', 111, {}));
    assert(r.data.action === 'ignore', JSON.stringify(r));
  });
  await test('unknown variant is ignored with 200 (no retries)', async () => {
    const r = await webhook(orderEvent('order_created', 999));
    assert(r.status === 200 && r.data.action === 'ignore', JSON.stringify(r));
  });
  await test('order_refunded marks the order refunded', async () => {
    await webhook({ meta: { event_name: 'order_created' }, data: { id: '7002', attributes: { user_email: MEMBER.email, status: 'paid', first_order_item: { variant_id: 333 } } } });
    const r = await webhook({ meta: { event_name: 'order_refunded' }, data: { id: '7002', attributes: {} } });
    assert(r.data.action === 'status', JSON.stringify(r));
    assert(db.find((x) => x.source_id === 'order:7002:333').status === 'refunded', 'not refunded');
  });

  /* Sign-in */
  await test('sign-in sends a magic link and shows "Check your inbox"', async () => {
    const p = await newPage();
    await p.goto(`${APP}/sign-in?next=/account`, { waitUntil: 'networkidle0' });
    await p.type('#email', 'new.person@example.com');
    await Promise.all([p.waitForSelector('.alert-ok', { timeout: 10000 }), p.click('button[type=submit]')]);
    const otp = log.find((l) => l.path === '/auth/v1/otp');
    assert(otp && otp.body.includes('new.person@example.com'), 'no OTP request to Supabase');
    assert(decodeURIComponent(otp.search).includes('/auth/callback?next=%2Faccount'), `redirect missing: ${otp.search}`);
    await p.close();
  });
  await test('sign-in rejects an invalid email', async () => {
    const p = await newPage();
    await p.goto(`${APP}/sign-in`, { waitUntil: 'networkidle0' });
    await p.type('#email', 'not-an-email');
    await Promise.all([p.waitForSelector('.alert-err', { timeout: 10000 }), p.click('button[type=submit]')]);
    await p.close();
  });
  await test('sign-in is rate limited per email (4th attempt blocked)', async () => {
    const p = await newPage();
    let blocked = false;
    for (let i = 0; i < 4 && !blocked; i++) {
      await p.goto(`${APP}/sign-in`, { waitUntil: 'networkidle0' });
      await p.type('#email', 'limit@example.com');
      await p.click('button[type=submit]');
      await p.waitForSelector('.alert-ok, .alert-err', { timeout: 10000 });
      blocked = !!(await p.$('.alert-err'));
    }
    assert(blocked, 'never rate limited');
    await p.close();
  });
  await test('callback without a code returns to sign-in with an error', async () => {
    const r = await fetch(`${APP}/auth/callback?next=/account`, { redirect: 'manual' });
    assert(r.status >= 300 && r.status < 400 && (r.headers.get('location') || '').includes('/sign-in?error=link'), `${r.status} ${r.headers.get('location')}`);
  });
  await test('callback ignores off-site "next" (no open redirect)', async () => {
    const r = await fetch(`${APP}/auth/callback?next=//evil.example`, { redirect: 'manual' });
    assert(!(r.headers.get('location') || '').includes('evil.example'), r.headers.get('location'));
  });

  /* Protected routes without a session */
  await test('/account without a session redirects to sign-in', async () => {
    const r = await fetch(`${APP}/account`, { redirect: 'manual' });
    assert(r.status >= 300 && r.status < 400 && (r.headers.get('location') || '').includes('/sign-in?next=%2Faccount'), `${r.status} ${r.headers.get('location')}`);
  });
  await test('/learn/<course> without a session redirects to sign-in', async () => {
    const r = await fetch(`${APP}/learn/product-visualization-masterclass`, { redirect: 'manual' });
    assert(r.status >= 300 && r.status < 400 && (r.headers.get('location') || '').includes('/sign-in'), `${r.status}`);
  });
  await test('download without a session is refused (401)', async () => {
    const r = await fetch(`${APP}/api/member/download?id=studio-scene-2026-11`, { redirect: 'manual' });
    assert(r.status === 401, `got ${r.status}`);
  });
  await test('sign-out from another site is refused (403)', async () => {
    const r = await fetch(`${APP}/auth/sign-out`, { method: 'POST', headers: { origin: 'https://evil.example' }, redirect: 'manual' });
    assert(r.status === 403, `got ${r.status}`);
  });

  /* Signed-in member */
  const page = await newPage();
  await page.setCookie(sessionCookie());
  await test('account shows Pro membership, billing link, course and member files', async () => {
    await page.goto(`${APP}/account`, { waitUntil: 'networkidle0' });
    const text = await page.evaluate(() => document.querySelector('main').innerText);
    assert(text.includes(MEMBER.email), 'email not shown');
    assert(/Pro member/.test(text), 'Pro membership not shown');
    assert(await page.$('a[href="https://example.lemonsqueezy.com/billing"]'), 'billing link missing');
    assert(await page.$('a[href="/learn/product-visualization-masterclass"]'), 'Open course link missing');
    assert(await page.$('a[href^="/api/member/download?id=studio-scene-2026-11"]'), 'member file download missing');
  });
  await test('course page plays for a member with access', async () => {
    await page.goto(`${APP}/learn/product-visualization-masterclass`, { waitUntil: 'networkidle0' });
    assert(await page.$('.lesson'), 'lesson list missing');
  });
  await test('member download redirects to a short-lived signed URL', async () => {
    const cookie = sessionCookie();
    const r = await fetch(`${APP}/api/member/download?id=studio-scene-2026-11`, { headers: { cookie: `${cookie.name}=${cookie.value}` }, redirect: 'manual' });
    const loc = r.headers.get('location') || '';
    assert(r.status === 302 && loc.includes('/storage/v1/object/sign/member-files/scenes/2026-11-studio.zip') && loc.includes('token='), `${r.status} ${loc}`);
    assert((r.headers.get('cache-control') || '').includes('no-store'), 'missing no-store');
  });
  await test('unknown download id returns 404', async () => {
    const cookie = sessionCookie();
    const r = await fetch(`${APP}/api/member/download?id=../../etc/passwd`, { headers: { cookie: `${cookie.name}=${cookie.value}` }, redirect: 'manual' });
    assert(r.status === 404, `got ${r.status}`);
  });
  await test('a cancelled membership past its end date loses access', async () => {
    await webhook(subEvent('subscription_cancelled', { status: 'cancelled', ends_at: '2000-01-01T00:00:00Z' }));
    db.find((x) => x.source_id === 'order:7001:222').status = 'refunded'; // remove the course purchase too
    await page.goto(`${APP}/learn/product-visualization-masterclass`, { waitUntil: 'networkidle0' });
    const text = await page.evaluate(() => document.querySelector('main').innerText);
    assert(/isn.t on your account/.test(text), 'still has access');
    const cookie = sessionCookie();
    const r = await fetch(`${APP}/api/member/download?id=studio-scene-2026-11`, { headers: { cookie: `${cookie.name}=${cookie.value}` }, redirect: 'manual' });
    assert(r.status === 403, `download got ${r.status}`);
  });
  await test('a cancelled membership before its end date keeps access', async () => {
    await webhook(subEvent('subscription_cancelled', { status: 'cancelled', ends_at: '2099-01-01T00:00:00Z' }));
    await page.goto(`${APP}/account`, { waitUntil: 'networkidle0' });
    const text = await page.evaluate(() => document.querySelector('main').innerText);
    assert(/Cancelled\. Access continues until/.test(text), 'cancellation notice missing');
  });
  await page.close();
} finally {
  await browser.close();
  app.kill();
  mock.close();
}

console.log(results.join('\n'));
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
