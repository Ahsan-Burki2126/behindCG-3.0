// 3D viewer test. Needs a model at public/models/plant-based-sleeping-mask.glb at build time
// (run `npm run models` first), then: npm run build && npm run start, and in another terminal:
//   node tests/e2e/model3d.mjs        (BASE_URL defaults to http://localhost:3000)
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
let failed = 0;
const check = (name, ok, detail = '') => { results.push(`  ${ok ? '✓' : '✗'} ${name}${ok ? '' : `\n      ${detail}`}`); if (!ok) failed++; };

const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.evaluateOnNewDocument(() => localStorage.setItem('bcg-consent', 'essential'));
const requests = [];
const errors = [];
p.on('request', (r) => requests.push(r.url()));
p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
p.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));

await p.goto(`${BASE}/portfolio/plant-based-sleeping-mask`, { waitUntil: 'networkidle0' });
const before = [...requests];
check('nothing 3D is downloaded before the click', !before.some((u) => /\.glb|draco|model-viewer/i.test(u)), before.filter((u) => /\.glb|draco/i.test(u)).join(', '));
const btn = await p.$('.mv-start');
check('"View in 3D" button is shown when a model exists', !!btn, 'no .mv-start (was the model present at build time?)');

if (btn) {
  const label = await p.evaluate((el) => el.innerText, btn);
  check('button shows the model size', /MB/.test(label), label);
  await btn.click();
  let status = '';
  for (let i = 0; i < 60; i++) {
    status = await p.evaluate(() => document.querySelector('.mv')?.className ?? '');
    if (/mv-ready|mv-error/.test(status)) break;
    await wait(500);
  }
  check('model loads and the viewer becomes ready', /mv-ready/.test(status), status);
  check('the .glb was requested after the click', requests.some((u) => u.includes('/models/plant-based-sleeping-mask.glb')));
  check('Draco decoder came from this site, not a CDN', requests.some((u) => u.includes('/decoders/draco/')) && !requests.some((u) => /gstatic\.com/.test(u)), requests.filter((u) => /draco/i.test(u)).join(', '));
  const loaded = await p.evaluate(() => { const mv = document.querySelector('model-viewer'); return mv ? { loaded: mv.loaded, modelIsVisible: mv.modelIsVisible } : null; });
  check('model-viewer reports the model loaded', !!loaded?.loaded, JSON.stringify(loaded));
  check('poster hides once the model is ready', await p.evaluate(() => getComputedStyle(document.querySelector('.mv-poster')).visibility === 'hidden'));
  await p.screenshot({ path: process.env.SHOT || 'model3d.png' });
}
check('no console errors or CSP violations', errors.length === 0, errors.join(' | '));

await b.close();
console.log(results.join('\n'));
console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
