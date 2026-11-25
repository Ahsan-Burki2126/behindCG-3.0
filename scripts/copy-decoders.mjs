// Copies the Draco mesh decoder from three.js into public/decoders/draco so compressed
// 3D models decode from this site instead of Google's CDN (faster, private, CSP-friendly).
// Runs automatically before `npm run build` and `npm run dev`.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const src = join('node_modules', 'three', 'examples', 'jsm', 'libs', 'draco', 'gltf');
const out = join('public', 'decoders', 'draco');

if (!existsSync(src)) {
  console.warn('[copy-decoders] three.js Draco decoder not found; 3D models compressed with Draco will not load.');
  process.exit(0);
}
mkdirSync(out, { recursive: true });
for (const f of ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js']) copyFileSync(join(src, f), join(out, f));
console.log('[copy-decoders] Draco decoder copied to public/decoders/draco');
