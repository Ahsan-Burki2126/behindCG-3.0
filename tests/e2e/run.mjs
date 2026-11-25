// Behind CG end-to-end suite (headless Chrome via puppeteer-core, no test framework).
//
// Run against an already running production server:
//   npm run build && npm run start            # in one terminal (port 3000)
//   npm run test:e2e                          # in another
// Or point it elsewhere:
//   BASE_URL=http://localhost:3201 CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" npm run test:e2e
// Optional: ONLY=<substring> runs only tests whose name contains it. CONCURRENCY=<n> (default 4) for route sweeps.
//
// The quote webhook success path needs its own server with QUOTE_WEBHOOK_URL set, so it lives
// in tests/e2e/webhook.mjs (self-contained: `node tests/e2e/webhook.mjs`).
// Exit code is non-zero when any test fails.

import {
  BASE_URL, makeRunner, assert, eq, newPage, goto, scrollThrough, clickByText, fetchText, fillValidQuote, closeBrowser, sleep,
} from './lib.mjs';

const { test: rawTest, run } = makeRunner();
const ONLY = process.env.ONLY;
const test = (name, fn, opts) => (!ONLY || name.includes(ONLY)) && rawTest(name, fn, opts);

const SERVICE = '/services/product-visualization';
const ADDON = '/addons/batch-render-pro';
const POST = '/blog/how-we-light-glass-bottles-in-blender';
const COURSE = '/courses/product-visualization-masterclass';
const CASE = '/portfolio/plant-based-sleeping-mask';
const FILM = '/animations/wireless-earbuds-launch-film';

// Unique client IP per API call so the in-memory rate limiter (keyed on x-forwarded-for) never interferes.
let ipSeq = Math.floor(Math.random() * 200);
const freshIp = () => `10.${Math.floor(Math.random() * 250)}.${(ipSeq++) % 250}.${Math.floor(Math.random() * 250)}`;

/* ---------------- route list from the sitemap ---------------- */
const { res: smRes, text: sitemap } = await fetchText('/sitemap.xml').catch((e) => {
  console.error(`Cannot reach ${BASE_URL}: ${e.message}. Start the server first.`);
  process.exit(2);
});
if (!smRes.ok) {
  console.error(`/sitemap.xml returned ${smRes.status}`);
  process.exit(2);
}
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname || '/');
const ROUTES = [...new Set([...sitemapPaths, '/get-a-quote', '/thank-you'])];
console.log(`Testing ${BASE_URL}: ${ROUTES.length} routes\n`);

const internalLinks = new Set();

/* ======================= 1-3. Route sweeps ======================= */
for (const path of ROUTES) {
  test(`route ${path} @1440: 200, meta, one h1, no errors, no overflow`, async () => {
    const page = await newPage({ width: 1440 });
    try {
      const res = await goto(page, path);
      eq(res.status(), 200, 'status');
      await sleep(500);
      const info = await page.evaluate(() => ({
        title: document.title.trim(),
        desc: document.querySelector('meta[name="description"]')?.content?.trim() ?? '',
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
        h1: document.querySelectorAll('h1').length,
        sw: document.documentElement.scrollWidth,
        iw: innerWidth,
        links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
      }));
      info.links.forEach((l) => internalLinks.add(l.split('#')[0] || '/'));
      const problems = [];
      if (!info.title) problems.push('empty <title>');
      if (!info.desc) problems.push('missing meta description');
      if (!info.canonical) problems.push('missing canonical');
      if (info.h1 !== 1) problems.push(`${info.h1} <h1> elements`);
      if (info.sw > info.iw) problems.push(`horizontal overflow ${info.sw} > ${info.iw}`);
      const csp = await page.cspViolations();
      if (csp.length) problems.push(`CSP violations: ${csp.join(' | ')}`);
      if (page.errors.length) problems.push(`errors: ${page.errors.join(' | ')}`);
      assert(!problems.length, problems.join('; '));
    } finally {
      await page.done();
    }
  }, { group: 'routes1440' });
}

async function overflowOffenders(page) {
  return page.evaluate(() => {
    const W = innerWidth;
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > W + 1) {
        const p = el.parentElement?.getBoundingClientRect();
        if (!p || p.right <= W + 1) out.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
      }
    }
    return out.slice(0, 5);
  });
}

for (const width of [390, 768]) {
  for (const path of ROUTES) {
    test(`route ${path} @${width}: no overflow, no errors`, async () => {
      const page = await newPage({ width, height: width === 390 ? 844 : 1024, mobile: width === 390 });
      try {
        const res = await goto(page, path);
        eq(res.status(), 200, 'status');
        await sleep(400);
        const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
        const problems = [];
        if (sw > iw) problems.push(`horizontal overflow ${sw} > ${iw}; offenders: ${(await overflowOffenders(page)).join(', ')}`);
        const csp = await page.cspViolations();
        if (csp.length) problems.push(`CSP violations: ${csp.join(' | ')}`);
        if (page.errors.length) problems.push(`errors: ${page.errors.join(' | ')}`);
        assert(!problems.length, problems.join('; '));
      } finally {
        await page.done();
      }
    }, { group: `routes${width}` });
  }
}

test('404: /does-not-exist returns 404 with the custom page', async () => {
  const { res, text } = await fetchText('/does-not-exist');
  eq(res.status, 404, 'status');
  assert(text.includes('This page is out of frame'), 'custom 404 heading missing');
  const page = await newPage();
  try {
    const r = await goto(page, '/does-not-exist');
    eq(r.status(), 404, 'browser status');
    const h1 = await page.$eval('h1', (el) => el.textContent.trim());
    eq(h1, 'This page is out of frame', 'h1');
    assert(!page.errors.filter((e) => !e.includes('404')).length, `errors: ${page.errors.join(' | ')}`);
  } finally {
    await page.done();
  }
});

const ASSETS = [
  ['/robots.txt', /text\/plain/],
  ['/sitemap.xml', /xml/],
  ['/manifest.webmanifest', /manifest\+json|json/],
  ['/opengraph-image', /image\/png/],
  ['/icon.svg', /image\/svg\+xml/],
  ['/favicon.ico', /image\/(x-icon|vnd\.microsoft\.icon)/],
  ['/addons/batch-render-pro/opengraph-image', /image\/png/],
  ['/blog/how-we-light-glass-bottles-in-blender/opengraph-image', /image\/png/],
];
for (const [path, type] of ASSETS) {
  test(`asset ${path}: 200 + content type`, async () => {
    const res = await fetch(BASE_URL + path);
    eq(res.status, 200, 'status');
    const ct = res.headers.get('content-type') ?? '';
    assert(type.test(ct), `content-type "${ct}" does not match ${type}`);
    const buf = Buffer.from(await res.arrayBuffer());
    assert(buf.length > 20, `body only ${buf.length} bytes`);
    if (path === '/robots.txt') assert(/sitemap/i.test(buf.toString()), 'robots.txt has no Sitemap line');
    if (path === '/manifest.webmanifest') assert(JSON.parse(buf.toString()).name, 'manifest has no name');
    if (type.source.includes('png')) assert(buf.subarray(1, 4).toString() === 'PNG', 'not a PNG');
  });
}

/* ======================= 4. Security headers ======================= */
test('security headers on /', async () => {
  const res = await fetch(BASE_URL + '/');
  const missing = ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy'].filter((h) => !res.headers.get(h));
  assert(!missing.length, `missing: ${missing.join(', ')}`);
  assert(!res.headers.get('x-powered-by'), `X-Powered-By present: ${res.headers.get('x-powered-by')}`);
  eq(res.headers.get('x-content-type-options'), 'nosniff', 'X-Content-Type-Options');
});

/* ======================= 5. Structured data ======================= */
for (const path of ['/', '/faq', ADDON, POST, SERVICE, COURSE]) {
  test(`JSON-LD on ${path} parses and has @type`, async () => {
    const { text } = await fetchText(path);
    const blocks = [...text.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    assert(blocks.length > 0, 'no ld+json blocks');
    blocks.forEach((b, i) => {
      let data;
      try { data = JSON.parse(b); } catch (e) { throw new Error(`block ${i} invalid JSON: ${e.message}`); }
      const items = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];
      items.forEach((it, j) => assert(it && it['@type'], `block ${i} item ${j} has no @type`));
    });
  });
}

/* ======================= 6. Desktop nav ======================= */
for (const label of ['Work', 'Services', 'Products', 'Learn']) {
  test(`desktop nav: ${label} dropdown opens, Escape + outside click close`, async () => {
    const page = await newPage({ width: 1440 });
    try {
      await goto(page, '/about');
      const btnSel = `.nav-links button`;
      const getBtn = async () => {
        for (const h of await page.$$(btnSel)) if ((await h.evaluate((e) => e.textContent.trim())) === label) return h;
        throw new Error(`no nav button ${label}`);
      };
      let btn = await getBtn();
      eq(await btn.evaluate((e) => e.getAttribute('aria-expanded')), 'false', 'aria-expanded initially');
      await btn.click();
      await page.waitForSelector('#nav-panel', { visible: true, timeout: 3000 });
      const links = await page.$$eval('#nav-panel a[href]', (as) => as.length);
      assert(links >= 3, `panel has ${links} links`);
      eq(await btn.evaluate((e) => e.getAttribute('aria-expanded')), 'true', 'aria-expanded when open');
      await page.keyboard.press('Escape');
      await page.waitForSelector('#nav-panel', { hidden: true, timeout: 3000 });
      eq(await btn.evaluate((e) => e.getAttribute('aria-expanded')), 'false', 'aria-expanded after Escape');
      // Toggle via the button again, then outside click
      await btn.click();
      await page.waitForSelector('#nav-panel', { visible: true, timeout: 3000 });
      await btn.click();
      await page.waitForSelector('#nav-panel', { hidden: true, timeout: 3000 });
      await btn.click();
      await page.waitForSelector('#nav-panel', { visible: true, timeout: 3000 });
      const header = await page.evaluate(() => Math.max(document.querySelector('header.nav').getBoundingClientRect().bottom, document.querySelector('#nav-panel').getBoundingClientRect().bottom));
      if (header < 870) await page.mouse.click(720, header + 20);
      else await page.evaluate(() => document.querySelector('main').dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
      await page.waitForSelector('#nav-panel', { hidden: true, timeout: 3000 });
      btn = await getBtn();
      eq(await btn.evaluate((e) => e.getAttribute('aria-expanded')), 'false', 'aria-expanded after outside click');
      assert(!page.errors.length, page.errors.join(' | '));
    } finally {
      await page.done();
    }
  });
}

test('desktop nav: only "Services" is active on a service page', async () => {
  const page = await newPage({ width: 1440 });
  try {
    await goto(page, SERVICE);
    const active = await page.$$eval('.nav-links .is-active', (els) => els.map((e) => e.textContent.trim()));
    eq(JSON.stringify(active), JSON.stringify(['Services']), 'active items');
  } finally {
    await page.done();
  }
});

/* ======================= 7. Mobile nav ======================= */
test('mobile nav: opens, navigates, closes after navigation', async () => {
  const page = await newPage({ width: 390, height: 844, mobile: true });
  try {
    await goto(page, '/');
    await page.click('.nav-menu');
    await page.waitForSelector('#mobile-nav', { visible: true, timeout: 3000 });
    eq(await page.$eval('.nav-menu', (b) => b.getAttribute('aria-expanded')), 'true', 'menu aria-expanded');
    const n = await page.$$eval('#mobile-nav a[href]', (as) => as.length);
    assert(n >= 10, `only ${n} links in mobile nav`);
    await page.click('#mobile-nav a[href="/faq"]');
    await page.waitForFunction(() => location.pathname === '/faq', { timeout: 10000 });
    await page.waitForSelector('#mobile-nav', { hidden: true, timeout: 5000 });
    eq(await page.$eval('.nav-menu', (b) => b.getAttribute('aria-expanded')), 'false', 'menu aria-expanded after nav');
    eq(await page.$eval('h1', (h) => h.textContent.length > 0), true, 'faq h1');
    // Escape closes too
    await page.click('.nav-menu');
    await page.waitForSelector('#mobile-nav', { visible: true });
    await page.keyboard.press('Escape');
    await page.waitForSelector('#mobile-nav', { hidden: true, timeout: 3000 });
    assert(!page.errors.length, page.errors.join(' | '));
  } finally {
    await page.done();
  }
});

/* ======================= 8. Portfolio filter + lightbox ======================= */
test('portfolio: filter tabs change cards and aria-pressed', async () => {
  const page = await newPage();
  try {
    await goto(page, '/portfolio');
    const count = () => page.$$eval('.masonry > div', (d) => d.length);
    const all = await count();
    assert(all > 1, `only ${all} cards`);
    const tabs = await page.$$eval('.tabs button', (bs) => bs.map((b) => b.textContent.trim()));
    let changed = false;
    for (const t of tabs.slice(1)) {
      await clickByText(page, '.tabs button', t);
      await sleep(150);
      const n = await count();
      if (n !== all) changed = true;
      assert(n > 0, `tab ${t} shows no cards`);
      const pressed = await page.$$eval('.tabs button', (bs) => bs.map((b) => [b.textContent.trim(), b.getAttribute('aria-pressed')]));
      for (const [name, p] of pressed) eq(p, name === t ? 'true' : 'false', `aria-pressed of ${name} with ${t} selected`);
    }
    assert(changed, 'no tab changed the number of cards');
    await clickByText(page, '.tabs button', 'All');
    await sleep(150);
    eq(await count(), all, 'All restores every card');
  } finally {
    await page.done();
  }
});

test('portfolio: lightbox opens, next/prev/arrows change title, Escape and close button close', async () => {
  const page = await newPage();
  try {
    await goto(page, '/portfolio');
    await scrollThrough(page);
    const opener = await page.$('.lb-open');
    assert(opener, 'no zoomable card (.lb-open)');
    await opener.evaluate((e) => e.scrollIntoView({ block: 'center' }));
    await sleep(300);
    await opener.click();
    await page.waitForSelector('dialog.lb[open]', { timeout: 3000 });
    const title = () => page.$eval('dialog.lb .lb-bar .h4', (e) => e.textContent.trim());
    const t0 = await title();
    await page.click('dialog.lb button[aria-label="Next image"]');
    await sleep(150);
    const t1 = await title();
    assert(t1 !== t0, `Next did not change title (${t0})`);
    await page.click('dialog.lb button[aria-label="Previous image"]');
    await sleep(150);
    eq(await title(), t0, 'Previous returns to first');
    await page.keyboard.press('ArrowRight');
    await sleep(150);
    eq(await title(), t1, 'ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await sleep(150);
    eq(await title(), t0, 'ArrowLeft');
    await page.keyboard.press('Escape');
    await page.waitForSelector('dialog.lb[open]', { hidden: true, timeout: 3000 });
    await opener.click();
    await page.waitForSelector('dialog.lb[open]', { timeout: 3000 });
    await page.click('dialog.lb button[aria-label="Close"]');
    await page.waitForFunction(() => !document.querySelector('dialog.lb').open, { timeout: 3000 });
    assert(!page.errors.length, page.errors.join(' | '));
  } finally {
    await page.done();
  }
});

/* ======================= 9. Blog + animations filters ======================= */
for (const path of ['/blog', '/animations']) {
  test(`${path}: filter tabs change the item count`, async () => {
    const page = await newPage();
    try {
      await goto(page, path);
      const count = () => page.$eval('.tabs', (t) => {
        const live = t.nextElementSibling;
        const grid = live.nextElementSibling;
        return { live: parseInt(live.textContent, 10), cells: grid.children.length };
      });
      const all = await count();
      eq(all.live, all.cells, 'live region count matches grid');
      const tabs = await page.$$eval('.tabs button', (bs) => bs.map((b) => b.textContent.trim()));
      assert(tabs.length > 1, 'no filter tabs');
      let changed = false;
      for (const t of tabs.slice(1)) {
        await clickByText(page, '.tabs button', t);
        await sleep(150);
        const c = await count();
        eq(c.live, c.cells, `live count for ${t}`);
        if (c.cells !== all.cells) changed = true;
        eq(await page.$$eval('.tabs button[aria-pressed="true"]', (b) => b.map((x) => x.textContent.trim()).join()), t, 'pressed tab');
      }
      assert(changed, 'no tab changed the count');
    } finally {
      await page.done();
    }
  });
}

/* ======================= 10. Accordions ======================= */
for (const path of ['/faq', SERVICE]) {
  test(`accordion on ${path}: click and Enter toggle aria-expanded + hidden`, async () => {
    const page = await newPage();
    try {
      await goto(page, path);
      await scrollThrough(page);
      const btns = await page.$$('.acc-btn');
      assert(btns.length >= 2, `only ${btns.length} accordion buttons`);
      const state = (b) => b.evaluate((el) => ({ exp: el.getAttribute('aria-expanded'), hidden: document.getElementById(el.getAttribute('aria-controls')).hidden }));
      await btns[0].evaluate((e) => e.scrollIntoView({ block: 'center' }));
      await sleep(300);
      eq(JSON.stringify(await state(btns[0])), JSON.stringify({ exp: 'false', hidden: true }), 'initial');
      await btns[0].click();
      eq(JSON.stringify(await state(btns[0])), JSON.stringify({ exp: 'true', hidden: false }), 'after click');
      await btns[0].click();
      eq(JSON.stringify(await state(btns[0])), JSON.stringify({ exp: 'false', hidden: true }), 'after second click');
      await btns[1].focus();
      await page.keyboard.press('Enter');
      eq(JSON.stringify(await state(btns[1])), JSON.stringify({ exp: 'true', hidden: false }), 'after Enter');
      await page.keyboard.press('Space');
      eq(JSON.stringify(await state(btns[1])), JSON.stringify({ exp: 'false', hidden: true }), 'after Space');
    } finally {
      await page.done();
    }
  });
}

/* ======================= 11. Before/after ======================= */
test('before/after slider responds to arrow keys and changes clip-path', async () => {
  const page = await newPage();
  try {
    await goto(page, CASE);
    await scrollThrough(page);
    const clip = () => page.$eval('.ba > div[style*="clip-path"]', (d) => d.style.clipPath);
    const val = () => page.$eval('.ba-range', (r) => Number(r.value));
    await page.$eval('.ba-range', (r) => r.scrollIntoView({ block: 'center' }));
    await page.focus('.ba-range');
    const c0 = await clip();
    const v0 = await val();
    for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
    const v1 = await val();
    assert(v1 > v0, `ArrowRight did not increase value (${v0} -> ${v1})`);
    const c1 = await clip();
    assert(c1 !== c0, `clip-path unchanged after ArrowRight (${c0})`);
    for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowLeft');
    assert((await val()) < v0, 'ArrowLeft did not decrease value');
    assert((await clip()) !== c1, 'clip-path unchanged after ArrowLeft');
  } finally {
    await page.done();
  }
});

test('case study loads no model-viewer script or .glb on load', async () => {
  const page = await newPage();
  const urls = [];
  page.on('request', (r) => urls.push(r.url()));
  try {
    await goto(page, CASE);
    await sleep(1000);
    const bad = urls.filter((u) => /model-viewer|\.glb(\?|$)/i.test(u));
    assert(!bad.length, `requested: ${bad.join(', ')}`);
  } finally {
    await page.done();
  }
});

/* ======================= 12. Cookie banner ======================= */
for (const choice of ['Accept all', 'Reject non-essential']) {
  test(`cookie banner: "${choice}" hides it and persists across reload`, async () => {
    const page = await newPage({ consent: false });
    try {
      await goto(page, '/');
      await page.waitForSelector('section.cookie', { visible: true, timeout: 5000 });
      await clickByText(page, 'section.cookie button', choice);
      await page.waitForSelector('section.cookie', { hidden: true, timeout: 3000 });
      eq(await page.evaluate(() => localStorage.getItem('bcg-consent')), choice === 'Accept all' ? 'all' : 'essential', 'stored value');
      await page.reload({ waitUntil: 'networkidle2' });
      await sleep(800);
      eq(await page.$('section.cookie'), null, 'banner after reload');
    } finally {
      await page.done();
    }
  });
}

test('cookie banner: footer "Cookie settings" reopens it', async () => {
  const page = await newPage({ consent: true });
  try {
    await goto(page, '/about');
    await sleep(500);
    eq(await page.$('section.cookie'), null, 'banner hidden with consent stored');
    await clickByText(page, 'footer button, .link-btn', 'Cookie settings');
    await page.waitForSelector('section.cookie', { visible: true, timeout: 3000 });
  } finally {
    await page.done();
  }
});

/* ======================= 13. Quote form ======================= */
async function quotePage() {
  const page = await newPage();
  // Give every browser-made API call its own client IP so reruns never hit the rate limit.
  await page.setRequestInterception(true);
  const ip = freshIp();
  page.on('request', (r) => {
    if (r.url().includes('/api/quote')) r.continue({ headers: { ...r.headers(), 'x-forwarded-for': ip } });
    else r.continue();
  });
  await goto(page, '/get-a-quote');
  await scrollThrough(page);
  await page.$eval('form.form', (f) => f.scrollIntoView({ block: 'start' }));
  await sleep(300);
  return page;
}

test('quote form: empty submit focuses the error summary and marks fields invalid', async () => {
  const page = await quotePage();
  try {
    await page.click('form.form button[type="submit"]');
    await page.waitForSelector('.alert-err[role="alert"]', { timeout: 3000 });
    await sleep(200);
    eq(await page.evaluate(() => document.activeElement?.matches('.alert-err[role="alert"]')), true, 'summary has focus');
    for (const id of ['name', 'email', 'details', 'consent']) {
      eq(await page.$eval(`#${id}`, (e) => e.getAttribute('aria-invalid')), 'true', `#${id} aria-invalid`);
    }
    const targets = await page.$$eval('.alert-err a[href^="#"]', (as) => as.map((a) => a.getAttribute('href').slice(1)));
    assert(targets.length >= 5, `summary has ${targets.length} links`);
    for (const t of targets) assert(await page.$(`[id="${t}"]`), `summary link #${t} has no target`);
    for (const t of ['name', 'email', 'services-0', 'details', 'consent']) assert(targets.includes(t), `no summary link to #${t}`);
  } finally {
    await page.done();
  }
});

test('quote form: invalid email and non-URL file link show specific messages', async () => {
  const page = await quotePage();
  try {
    await fillValidQuote(page, { email: 'not-an-email', files: 'my dropbox folder' });
    await page.click('form.form button[type="submit"]');
    await page.waitForSelector('#email-err', { timeout: 3000 });
    eq(await page.$eval('#email-err', (e) => e.textContent.trim()), 'Enter an email address in the format name@company.com.', 'email message');
    eq(await page.$eval('#files-err', (e) => e.textContent.trim()), 'Enter the full link, starting with https://.', 'files message');
    eq(await page.$eval('#email', (e) => e.getAttribute('aria-invalid')), 'true', 'email aria-invalid');
    eq(await page.$eval('#files', (e) => e.getAttribute('aria-invalid')), 'true', 'files aria-invalid');
    eq(await page.$('#name-err'), null, 'no name error');
  } finally {
    await page.done();
  }
});

test('quote form: without a webhook a valid submit shows "did not send" (503) and keeps values', async () => {
  const page = await quotePage();
  try {
    const v = await fillValidQuote(page);
    const resP = page.waitForResponse((r) => r.url().includes('/api/quote'), { timeout: 10000 });
    await page.click('form.form button[type="submit"]');
    const res = await resP;
    eq(res.status(), 503, 'API status');
    await page.waitForFunction(() => [...document.querySelectorAll('.alert-err[role="alert"]')].some((a) => a.textContent.includes('did not send')), { timeout: 5000 });
    eq(await page.$eval('#name', (e) => e.value), v.name, 'name kept');
    eq(await page.$eval('#email', (e) => e.value), v.email, 'email kept');
    eq(await page.$eval('#details', (e) => e.value), v.details, 'details kept');
    eq(await page.$eval('#consent', (e) => e.checked), true, 'consent kept');
    eq(await page.$eval('#services-0', (e) => e.checked), true, 'service kept');
    eq(await page.$eval('form.form button[type="submit"]', (b) => b.disabled), false, 'submit re-enabled');
    eq(page.url(), BASE_URL + '/get-a-quote', 'stayed on page');
  } finally {
    await page.done();
  }
});

/* ======================= 14. Quote API abuse ======================= */
const VALID = { name: 'A', email: 'a@b.co', company: '', services: ['Product renders'], details: 'x'.repeat(30), budget: '', launch: '', files: '', consent: true, website: '' };
const api = (body, headers = {}) =>
  fetch(BASE_URL + '/api/quote', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': freshIp(), ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

test('api: wrong content-type -> 415', async () => {
  eq((await api('name=a', { 'content-type': 'application/x-www-form-urlencoded' })).status, 415, 'status');
});
test('api: body over 32 KB -> 413', async () => {
  eq((await api({ ...VALID, details: 'x'.repeat(40 * 1024) })).status, 413, 'status');
});
test('api: invalid JSON -> 400', async () => {
  eq((await api('{"name":')).status, 400, 'status');
  eq((await api('[1,2]')).status, 400, 'array body status');
});
test('api: foreign Origin -> 403', async () => {
  eq((await api(VALID, { origin: 'https://evil.example' })).status, 403, 'status');
});
test('api: validation errors -> 422 with errors', async () => {
  const res = await api({ ...VALID, email: 'nope', services: ['Hacking'] });
  eq(res.status, 422, 'status');
  const j = await res.json();
  assert(j.errors?.email && j.errors?.services, `errors: ${JSON.stringify(j)}`);
});
test('api: honeypot filled -> 200 {ok:true}', async () => {
  const res = await api({ ...VALID, website: 'http://spam.example' });
  eq(res.status, 200, 'status');
  eq(JSON.stringify(await res.json()), '{"ok":true}', 'body');
});
test('api: GET is not allowed', async () => {
  const res = await fetch(BASE_URL + '/api/quote');
  eq(res.status, 405, 'status');
});

/* ======================= 15. Video players ======================= */
for (const path of ['/', '/animations', FILM]) {
  test(`video player on ${path}: disabled "Film coming soon", no iframe`, async () => {
    const page = await newPage();
    try {
      await goto(page, path);
      const vps = await page.$$eval('.vp-play', (bs) => bs.map((b) => ({ disabled: b.disabled, text: b.textContent.trim() })));
      assert(vps.length > 0, 'no .vp-play button');
      vps.forEach((v, i) => {
        eq(v.disabled, true, `player ${i} disabled`);
        assert(v.text.includes('Film coming soon'), `player ${i} text "${v.text}"`);
      });
      eq(await page.$$eval('iframe', (f) => f.length), 0, 'iframes on page');
    } finally {
      await page.done();
    }
  });
}

/* ======================= 16. GSAP motion ======================= */
test('motion: html.motion, __bcgMotion, home h1 animated by CSS and fully visible after 2s', async () => {
  const page = await newPage();
  try {
    await goto(page, '/');
    await sleep(2200);
    const r = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const words = [...h1.querySelectorAll('div, span')].filter((e) => !e.querySelector('div, span'));
      return {
        motion: document.documentElement.classList.contains('motion'),
        flag: window.__bcgMotion === true,
        words: words.length,
        anim: getComputedStyle(h1).animationName,
        clip: getComputedStyle(h1).clipPath,
        vis: getComputedStyle(h1).visibility,
        moved: words.filter((w) => { const m = new DOMMatrix(getComputedStyle(w).transform); return Math.abs(m.f) > 1; }).length,
        heroHidden: [...document.querySelectorAll('.hero-copy > *')].filter((e) => getComputedStyle(e).visibility === 'hidden' || getComputedStyle(e).opacity === '0').length,
      };
    });
    eq(r.motion, true, 'html.motion');
    eq(r.flag, true, '__bcgMotion');
    // The hero headline is revealed with a CSS mask (no JS split) so it paints before hydration.
    assert(/bcg-unmask/.test(r.anim), `h1 animation "${r.anim}"`);
    assert(r.words === 0, 'hero h1 should not be split by JS (LCP)');
    eq(r.vis, 'visible', 'h1 visibility');
    eq(r.moved, 0, 'words still offset after 2s');
    eq(r.heroHidden, 0, 'hidden hero children after 2s');
  } finally {
    await page.done();
  }
});

test('motion: horizontal showcase pins and its track moves on scroll', async () => {
  const page = await newPage();
  try {
    await goto(page, '/');
    await sleep(1500);
    eq(await page.$eval('.hs', (e) => e.classList.contains('hs-pinned')), true, '.hs-pinned');
    const top = await page.$eval('.hs', (e) => e.getBoundingClientRect().top + scrollY);
    const tf = () => page.$eval('.hs-track', (e) => getComputedStyle(e).transform);
    // scroll in steps so ScrollTrigger sees it
    for (let y = 0; y <= top; y += 300) { await page.evaluate((y) => scrollTo(0, y), y); await sleep(60); }
    await page.evaluate((y) => scrollTo(0, y), top);
    await sleep(1500);
    const t0 = await tf();
    for (let y = top; y <= top + 900; y += 150) { await page.evaluate((y) => scrollTo(0, y), y); await sleep(60); }
    await sleep(2000);
    const t1 = await tf();
    assert(t1 !== t0, `track transform unchanged (${t0})`);
    const x = new (class { constructor(s) { const m = s.match(/matrix\(([^)]+)\)/); this.x = m ? Number(m[1].split(',')[4]) : 0; } })(t1).x;
    assert(x < -100, `track x only ${x}`);
  } finally {
    await page.done();
  }
});

test('motion: header hides on scroll down and returns on scroll up', async () => {
  const page = await newPage();
  try {
    await goto(page, '/about');
    await sleep(800);
    for (let y = 0; y <= 800; y += 100) { await page.evaluate((y) => scrollTo(0, y), y); await sleep(60); }
    await sleep(500);
    eq(await page.$eval('header.nav', (e) => e.classList.contains('nav-hidden')), true, 'nav-hidden after scrolling down');
    for (let y = 800; y >= 500; y -= 100) { await page.evaluate((y) => scrollTo(0, y), y); await sleep(60); }
    await sleep(500);
    eq(await page.$eval('header.nav', (e) => e.classList.contains('nav-hidden')), false, 'nav-hidden after scrolling up');
  } finally {
    await page.done();
  }
});

test('motion: blog reading progress grows with scroll', async () => {
  const page = await newPage();
  try {
    await goto(page, POST);
    await sleep(800);
    const sx = () => page.$eval('.read-progress span', (e) => new DOMMatrix(getComputedStyle(e).transform).a);
    const s0 = await sx();
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= h / 2; y += 300) { await page.evaluate((y) => scrollTo(0, y), y); await sleep(50); }
    await sleep(1200);
    const s1 = await sx();
    assert(s1 > s0 + 0.1, `progress scale ${s0} -> ${s1}`);
  } finally {
    await page.done();
  }
});

for (const path of ['/', '/about', SERVICE, '/portfolio']) {
  test(`reduced motion on ${path}: no motion class, no pin, hero visible`, async () => {
    const page = await newPage({ reducedMotion: true });
    try {
      await goto(page, path);
      await sleep(800);
      const r = await page.evaluate(() => ({
        motion: document.documentElement.classList.contains('motion'),
        pinned: !!document.querySelector('.hs-pinned'),
        hidden: [...document.querySelectorAll('.hero *, .page-hero *')]
          .filter((e) => getComputedStyle(e).visibility === 'hidden')
          .map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].join('.')}`)
          .slice(0, 5),
      }));
      eq(r.motion, false, 'html.motion');
      eq(r.pinned, false, 'hs-pinned');
      assert(!r.hidden.length, `hidden hero elements: ${r.hidden.join(', ')}`);
    } finally {
      await page.done();
    }
  });
}

test('motion @390: showcase not pinned, viewport scrolls horizontally', async () => {
  const page = await newPage({ width: 390, height: 844, mobile: true });
  try {
    await goto(page, '/');
    await sleep(1200);
    eq(await page.$eval('.hs', (e) => e.classList.contains('hs-pinned')), false, 'hs-pinned');
    const r = await page.$eval('.hs-viewport', async (v) => {
      const before = v.scrollLeft;
      v.scrollLeft = 300;
      await new Promise((res) => setTimeout(res, 300));
      return { sw: v.scrollWidth, cw: v.clientWidth, before, after: v.scrollLeft, ox: getComputedStyle(v).overflowX };
    });
    assert(r.sw > r.cw, `viewport not wider than its box (${r.sw} <= ${r.cw})`);
    assert(r.after > r.before, `scrollLeft did not change (${JSON.stringify(r)})`);
  } finally {
    await page.done();
  }
});

/* ======================= 17. Below-the-fold reveals ======================= */
for (const path of ['/', '/about', SERVICE, '/addons']) {
  test(`reveals on ${path}: nothing left hidden after scrolling to the bottom`, async () => {
    const page = await newPage();
    try {
      await goto(page, path);
      await sleep(600);
      await scrollThrough(page, { step: 250, delay: 120, back: false });
      await sleep(1500);
      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll('.card, .fit-card, .tool, .step, .sh, .checks li')]
          .filter((e) => { const s = getComputedStyle(e); return s.visibility === 'hidden' || s.opacity === '0'; })
          .map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].join('.')} "${e.textContent.trim().slice(0, 30)}"`)
      );
      assert(!hidden.length, `${hidden.length} still hidden: ${hidden.slice(0, 5).join(' | ')}`);
    } finally {
      await page.done();
    }
  });
}

/* ======================= 18. Skip link ======================= */
test('skip link: first Tab focuses it, Enter moves to #main', async () => {
  const page = await newPage();
  try {
    await goto(page, '/about');
    await page.keyboard.press('Tab');
    eq(await page.evaluate(() => document.activeElement?.textContent.trim()), 'Skip to content', 'first focus');
    const top = await page.$eval('.skip', (e) => e.getBoundingClientRect().top);
    assert(top >= 0, `skip link not visible on focus (top ${top})`);
    await page.keyboard.press('Enter');
    await sleep(300);
    eq(await page.evaluate(() => location.hash), '#main', 'hash');
    await page.keyboard.press('Tab');
    const inMain = await page.evaluate(() => !!document.activeElement?.closest('#main'));
    eq(inMain, true, 'next Tab lands inside #main');
  } finally {
    await page.done();
  }
});

/* ======================= 19. Internal links (after the sweeps collected them) ======================= */
test('internal links: every a[href^="/"] returns 200 (member-only routes may redirect)', async () => {
  assert(internalLinks.size > 10, `only ${internalLinks.size} links collected (did the route sweep run?)`);
  const bad = [];
  await Promise.all(
    [...internalLinks].map(async (href) => {
      const res = await fetch(BASE_URL + href, { redirect: 'manual' });
      const memberOnly = /^\/(learn|account)(\/|$)/.test(href);
      if (res.status !== 200 && !(memberOnly && res.status >= 300 && res.status < 400)) bad.push(`${href} -> ${res.status}`);
    })
  );
  assert(!bad.length, bad.join(', '));
});

/* ======================= 14b. Rate limit (last: it burns quota for one IP) ======================= */
test('api: rate limits -> 429 with Retry-After (21 attempts of any kind, or 6 deliverable ones)', async () => {
  const ip = freshIp();
  const statuses = [];
  let retry = null;
  // Valid submissions (delivered or not) hit the strict limit of 5 per 10 minutes.
  for (let i = 0; i < 6; i++) {
    const res = await api(VALID, { 'x-forwarded-for': ip });
    statuses.push(res.status);
    if (res.status === 429) retry = res.headers.get('retry-after');
  }
  assert(statuses.includes(429), `valid: statuses ${statuses.join(',')}`);
  // Invalid attempts (typos) only count against the looser limit of 20.
  const ip2 = freshIp();
  const loose = [];
  for (let i = 0; i < 21; i++) loose.push((await api({ ...VALID, email: 'bad' }, { 'x-forwarded-for': ip2 })).status);
  assert(loose.slice(0, 20).every((st) => st === 422), `first 20 invalid: ${loose.slice(0, 20).join(',')}`);
  assert(loose[20] === 429, `21st invalid: ${loose[20]}`);
  assert(retry && Number(retry) > 0, `Retry-After "${retry}"`);
});

const failed = await run({ concurrency: Number(process.env.CONCURRENCY || 4) });
await closeBrowser();
process.exit(failed ? 1 : 0);
