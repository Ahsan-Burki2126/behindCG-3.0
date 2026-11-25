// Shrinks every .glb/.gltf in models-src/ for the web and writes it to public/models/.
//
//   npm run models
//
// What it does (gltf-transform "optimize"): removes unused data, welds and simplifies
// meshes, compresses geometry with Draco, resizes textures to 2048px max and converts
// them to WebP. A 40–80 MB Blender export usually ends up at 2–6 MB.
//
// Export from Blender: File > Export > glTF 2.0, format "glTF Binary (.glb)", apply
// modifiers, +Y up. Name the file after the slug it belongs to, e.g. plant-based-sleeping-mask.glb.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const SRC = 'models-src';
const OUT = join('public', 'models');
const BUDGET_MB = 6;

if (!existsSync(SRC)) {
  mkdirSync(SRC, { recursive: true });
  console.log(`Created ${SRC}/. Put your Blender .glb exports there and run "npm run models" again.`);
  process.exit(0);
}
mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => ['.glb', '.gltf'].includes(extname(f).toLowerCase()));
if (!files.length) {
  console.log(`No .glb or .gltf files in ${SRC}/.`);
  process.exit(0);
}

const cli = join('node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js');
const mb = (p) => statSync(p).size / 1024 / 1024;

for (const f of files) {
  const input = join(SRC, f);
  const output = join(OUT, `${basename(f, extname(f))}.glb`);
  console.log(`\n${f} (${mb(input).toFixed(1)} MB) → ${output}`);
  execFileSync(process.execPath, [cli, 'optimize', input, output,
    '--compress', 'draco',
    '--texture-compress', 'webp',
    '--texture-size', '2048',
    '--simplify', 'true',
  ], { stdio: 'inherit' });
  const size = mb(output);
  console.log(`  done: ${size.toFixed(1)} MB${size > BUDGET_MB ? `  ⚠ over the ${BUDGET_MB} MB budget: lower the polygon count or texture size in Blender` : ''}`);
}
