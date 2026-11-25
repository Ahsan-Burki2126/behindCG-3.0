import { statSync } from 'node:fs';
import { join } from 'node:path';
import ModelViewer from './ModelViewer';
import Render, { publicFileExists, type Obj, type Ratio, type Tone } from './Render';

// A render that becomes an interactive 3D model when a .glb exists for it.
// Put optimized models in public/models (run `npm run models`); without one, this is
// just the render, so pages never show a broken 3D button.
export default function Model3D({
  model,
  alt,
  src,
  tone,
  obj,
  ratio = 'r43',
  sizes,
}: {
  model?: string;
  alt: string;
  src?: string;
  tone?: Tone;
  obj?: Obj;
  ratio?: Ratio;
  sizes?: string;
}) {
  const poster = <Render src={src} tone={tone} obj={obj} ratio={ratio} alt={alt} sizes={sizes} />;
  if (!model || !publicFileExists(model)) return poster;
  const sizeMb = statSync(join(process.cwd(), 'public', model)).size / 1024 / 1024;
  return <ModelViewer src={model} alt={alt} sizeMb={sizeMb} poster={poster} />;
}
