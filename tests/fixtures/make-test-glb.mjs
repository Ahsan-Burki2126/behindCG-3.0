// Builds a small test product (a rounded jar: cylinder body + lid) as GLB, for testing the 3D viewer.
// Usage: npm run test:sample-model  (creates models-src/plant-based-sleeping-mask.glb and compresses it).
// Delete public/models/plant-based-sleeping-mask.glb again before deploying real content.
import { Document, NodeIO } from '@gltf-transform/core';
import { writeFileSync } from 'node:fs';

const out = process.argv[2];
const doc = new Document();
const buffer = doc.createBuffer();

function cylinder(radius, height, y0, segments = 48) {
  const pos = [], nor = [], idx = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2, x = Math.cos(a), z = Math.sin(a);
    pos.push(x * radius, y0, z * radius, x * radius, y0 + height, z * radius);
    nor.push(x, 0, z, x, 0, z);
  }
  for (let i = 0; i < segments; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  // caps
  const base = pos.length / 3;
  pos.push(0, y0, 0, 0, y0 + height, 0); nor.push(0, -1, 0, 0, 1, 0);
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pos.push(Math.cos(a) * radius, y0, Math.sin(a) * radius, Math.cos(a) * radius, y0 + height, Math.sin(a) * radius);
    nor.push(0, -1, 0, 0, 1, 0);
  }
  for (let i = 0; i < segments; i++) {
    const b = base + 2 + i * 2;
    idx.push(base, b + 2, b, base + 1, b + 1, b + 3);
  }
  return { pos, nor, idx };
}

function mesh(name, geo, color, rough, metal) {
  const p = doc.createAccessor().setType('VEC3').setArray(new Float32Array(geo.pos)).setBuffer(buffer);
  const n = doc.createAccessor().setType('VEC3').setArray(new Float32Array(geo.nor)).setBuffer(buffer);
  const i = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(geo.idx)).setBuffer(buffer);
  const mat = doc.createMaterial(name).setBaseColorFactor(color).setRoughnessFactor(rough).setMetallicFactor(metal);
  const prim = doc.createPrimitive().setAttribute('POSITION', p).setAttribute('NORMAL', n).setIndices(i).setMaterial(mat);
  return doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(prim));
}

const scene = doc.createScene('Jar');
scene.addChild(mesh('Body', cylinder(0.5, 0.55, 0), [0.92, 0.95, 0.94, 1], 0.35, 0));
scene.addChild(mesh('Lid', cylinder(0.53, 0.18, 0.55), [0.05, 0.42, 0.42, 1], 0.25, 0.6));
doc.getRoot().setDefaultScene(scene);
writeFileSync(out, await new NodeIO().writeBinary(doc));
console.log('wrote', out);
