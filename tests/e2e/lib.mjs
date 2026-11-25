// Shared helpers for the Behind CG end-to-end scripts (run.mjs, webhook.mjs).
import puppeteer from 'puppeteer-core';

export const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const CHROME_PATH = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------- tiny test runner ---------------- */
const results = [];
export function makeRunner() {
  const queue = [];
  const test = (name, fn, opts = {}) => queue.push({ name, fn, group: opts.group });
  async function run({ concurrency = 1 } = {}) {
    // Tests with the same `group` may run in parallel (up to `concurrency`); groups run in order.
    let i = 0;
    while (i < queue.length) {
      const g = queue[i].group;
      const batch = [];
      while (i < queue.length && queue[i].group === g && (g !== undefined || batch.length === 0)) batch.push(queue[i++]);
      const limit = g === undefined ? 1 : concurrency;
      let next = 0;
      await Promise.all(
        Array.from({ length: Math.min(limit, batch.length) }, async () => {
          while (next < batch.length) {
            const t = batch[next++];
            const start = Date.now();
            try {
              await t.fn();
              results.push({ name: t.name, ok: true });
              console.log(`  ok    ${t.name} (${Date.now() - start}ms)`);
            } catch (e) {
              results.push({ name: t.name, ok: false, err: e });
              console.log(`  FAIL  ${t.name} (${Date.now() - start}ms)\n        ${String(e?.message ?? e).split('\n').join('\n        ')}`);
            }
          }
        })
      );
    }
    const failed = results.filter((r) => !r.ok);
    console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`);
    if (failed.length) {
      console.log('\nFailures:');
      for (const f of failed) console.log(`  - ${f.name}: ${String(f.err?.message ?? f.err).split('\n')[0]}`);
    }
    return failed.length;
  }
  return { test, run };
}

export function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
export function eq(actual, expected, msg) {
  if (actual !== expected) throw new Error(`${msg}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

/* ---------------- browser ---------------- */
let browser;
export async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--mute-audio'],
    });
  }
  return browser;
}
export async function closeBrowser() {
  if (browser) await browser.close().catch(() => {});
  browser = undefined;
}

// New isolated page (own browser context = fresh localStorage) with error collection.
export async function newPage({ width = 1440, height = 900, consent = true, reducedMotion = false, mobile = false } = {}) {
  const b = await getBrowser();
  const ctx = await b.createBrowserContext();
  const page = await ctx.newPage();
  page.setDefaultTimeout(20000);
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}${m.location()?.url ? ` (${m.location().url})` : ''}`);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.evaluateOnNewDocument((c) => {
    if (c) {
      try { localStorage.setItem('bcg-consent', 'essential'); } catch {}
    }
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  }, consent);
  page.errors = errors;
  page.cspViolations = () => page.evaluate(() => window.__csp || []).catch(() => []);
  page.done = () => ctx.close().catch(() => {});
  return page;
}

export async function goto(page, path, opts = {}) {
  const url = path.startsWith('http') ? path : BASE_URL + path;
  return page.goto(url, { waitUntil: 'networkidle2', timeout: 30000, ...opts });
}

// Scroll slowly to the bottom (triggers every scroll reveal), optionally back to the top.
export async function scrollThrough(page, { step = 300, delay = 80, back = true } = {}) {
  await page.evaluate(
    async (step, delay) => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      let y = 0;
      for (let guard = 0; guard < 400; guard++) {
        const max = document.documentElement.scrollHeight - innerHeight;
        if (y >= max) break;
        y = Math.min(y + step, max);
        window.scrollTo(0, y);
        await wait(delay);
      }
    },
    step,
    delay
  );
  await sleep(1200);
  if (back) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(400);
  }
}

export async function clickByText(page, selector, text) {
  const handles = await page.$$(selector);
  for (const h of handles) {
    const t = await h.evaluate((el) => el.textContent.trim());
    if (t.includes(text)) {
      await h.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await sleep(150);
      await h.click();
      return;
    }
  }
  throw new Error(`No ${selector} with text "${text}"`);
}

export async function fetchText(path, init) {
  const res = await fetch(path.startsWith('http') ? path : BASE_URL + path, init);
  return { res, text: await res.text() };
}

// Fill the quote form with valid values (form must be visible: call scrollThrough first).
export async function fillValidQuote(page, overrides = {}) {
  const v = {
    name: 'Test Person',
    email: 'test@example.com',
    company: 'Test Co',
    details: 'A 50 ml frosted glass serum bottle, six packshots for Amazon.',
    files: 'https://example.com/files',
    ...overrides,
  };
  await page.type('#name', v.name);
  await page.type('#email', v.email);
  await page.type('#company', v.company);
  await page.$eval('#services-0', (el) => el.click());
  await page.type('#details', v.details);
  if (v.files) await page.type('#files', v.files);
  await page.$eval('#consent', (el) => el.click());
  return v;
}
