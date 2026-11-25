// Quote form success path: real form submit -> /api/quote -> webhook -> /thank-you.
//
// Self-contained: it starts a tiny webhook receiver on HOOK_PORT (default 3299) and its own
// `next start` on NEXT_PORT (default 3298) with QUOTE_WEBHOOK_URL and QUOTE_WEBHOOK_SECRET set,
// using the existing production build in .next (run `npm run build` first). Both are stopped at the end.
//   node tests/e2e/webhook.mjs
// To test an already running server instead (started with QUOTE_WEBHOOK_URL=http://localhost:3299/hook
// and QUOTE_WEBHOOK_SECRET=test), set BASE_URL and SPAWN=0:
//   SPAWN=0 BASE_URL=http://localhost:3201 node tests/e2e/webhook.mjs

import http from 'node:http';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOOK_PORT = Number(process.env.HOOK_PORT || 3299);
const NEXT_PORT = Number(process.env.NEXT_PORT || 3298);
const SPAWN = process.env.SPAWN !== '0';
if (SPAWN) process.env.BASE_URL = `http://localhost:${NEXT_PORT}`;

const { makeRunner, assert, eq, newPage, goto, scrollThrough, fillValidQuote, closeBrowser, sleep, BASE_URL } = await import('./lib.mjs');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const received = [];

const hook = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    received.push({ method: req.method, url: req.url, headers: req.headers, body });
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end('{"ok":true}');
  });
});
await new Promise((r, j) => hook.once('error', j).listen(HOOK_PORT, r));

let next;
async function stopAll() {
  hook.close();
  if (next && next.exitCode === null) {
    next.kill();
    await sleep(500);
  }
}

try {
  if (SPAWN) {
    const require = createRequire(import.meta.url);
    const bin = require.resolve('next/dist/bin/next', { paths: [root] });
    next = spawn(process.execPath, [bin, 'start', '-p', String(NEXT_PORT)], {
      cwd: root,
      env: { ...process.env, QUOTE_WEBHOOK_URL: `http://localhost:${HOOK_PORT}/hook`, QUOTE_WEBHOOK_SECRET: 'test' },
      stdio: 'ignore',
    });
    let up = false;
    for (let i = 0; i < 60 && !up; i++) {
      try { up = (await fetch(BASE_URL + '/robots.txt')).ok; } catch { await sleep(500); }
    }
    assert(up, `next start on ${NEXT_PORT} did not come up`);
  }

  const { test, run } = makeRunner();

  test('quote form: valid submit is delivered to the webhook and lands on /thank-you', async () => {
    const page = await newPage();
    try {
      await goto(page, '/get-a-quote');
      await scrollThrough(page);
      await page.$eval('form.form', (f) => f.scrollIntoView({ block: 'start' }));
      await sleep(300);
      // own client IP so reruns never hit the rate limiter
      await page.setRequestInterception(true);
      const ip = `10.99.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
      page.on('request', (r) => (r.url().includes('/api/quote') ? r.continue({ headers: { ...r.headers(), 'x-forwarded-for': ip } }) : r.continue()));
      const v = await fillValidQuote(page);
      await page.select('#budget', await page.$eval('#budget option:nth-child(2)', (o) => o.value));
      const resP = page.waitForResponse((r) => r.url().includes('/api/quote'), { timeout: 15000 });
      await page.click('form.form button[type="submit"]');
      const res = await resP;
      eq(res.status(), 200, 'API status');
      await page.waitForFunction(() => location.pathname === '/thank-you', { timeout: 10000 });
      eq(await page.$$eval('h1', (h) => h.length), 1, 'thank-you h1');

      eq(received.length, 1, 'webhook calls');
      const call = received[0];
      eq(call.method, 'POST', 'webhook method');
      eq(call.url, '/hook', 'webhook path');
      eq(call.headers.authorization, 'Bearer test', 'Authorization header');
      assert(/application\/json/.test(call.headers['content-type']), `content-type ${call.headers['content-type']}`);
      const body = JSON.parse(call.body);
      eq(body.name, v.name, 'name');
      eq(body.email, v.email, 'email');
      eq(body.company, v.company, 'company');
      eq(body.details, v.details, 'details');
      eq(body.files, v.files, 'files');
      eq(JSON.stringify(body.services), JSON.stringify(['Product renders']), 'services');
      eq(body.consent, true, 'consent');
      assert(body.budget, 'budget missing');
      assert(body.receivedAt && body.source, 'receivedAt/source missing');
      assert(!('website' in body), 'honeypot field leaked to webhook');
      assert(!page.errors.length, page.errors.join(' | '));
    } finally {
      await page.done();
    }
  });

  test('api: webhook failure -> 502', async () => {
    // Make the receiver fail once.
    const orig = hook.listeners('request')[0];
    hook.removeAllListeners('request');
    hook.on('request', (req, res) => { req.resume(); res.writeHead(500); res.end(); });
    try {
      const res = await fetch(BASE_URL + '/api/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.98.${Math.floor(Math.random() * 250)}.1` },
        body: JSON.stringify({ name: 'A', email: 'a@b.co', services: ['Product renders'], details: 'x'.repeat(30), consent: true }),
      });
      eq(res.status, 502, 'status');
    } finally {
      hook.removeAllListeners('request');
      hook.on('request', orig);
    }
  });

  const failed = await run();
  await closeBrowser();
  await stopAll();
  process.exit(failed ? 1 : 0);
} catch (e) {
  console.error(e);
  await closeBrowser();
  await stopAll();
  process.exit(1);
}
