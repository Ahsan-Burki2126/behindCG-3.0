import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';
import sharp from 'sharp';

// Image slot. Pass `src` (a path under /public, e.g. /images/work/serum.jpg): when the file
// exists it renders with next/image (resized per screen, AVIF/WebP, lazy below the fold)
// over a tiny blurred preview; until then the shaded render stand-in shows.
// Drop files into public/images with the names in lib/catalog.ts and they appear on the next build.
export type Tone = 'teal' | 'warm' | 'cool' | 'clay' | 'wire';
export type Obj = 'default' | 'bottle' | 'jar' | 'round' | 'box' | 'can';
export type Ratio = 'r219' | 'r169' | 'r43' | 'r32' | 'r11' | 'r45';

const fileFor = (src?: string) => (src && src.startsWith('/') ? join(process.cwd(), 'public', src) : '');
const hasFile = (src?: string) => !!fileFor(src) && existsSync(fileFor(src));

// 16px-wide blurred previews, computed once per image at build time.
const blurCache = new Map<string, Promise<string | undefined>>();
function blurFor(src: string) {
  if (!blurCache.has(src)) {
    blurCache.set(
      src,
      sharp(fileFor(src))
        .resize(16)
        .webp({ quality: 40 })
        .toBuffer()
        .then((b) => `data:image/webp;base64,${b.toString('base64')}`)
        .catch(() => undefined)
    );
  }
  return blurCache.get(src)!;
}

export default async function Render({
  alt,
  src,
  tone = 'teal',
  obj = 'default',
  ratio = 'r43',
  className = '',
  sizes = '(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  decorative = false,
  children,
}: {
  alt: string;
  src?: string;
  tone?: Tone;
  obj?: Obj;
  ratio?: Ratio | '';
  className?: string;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean; // inside a link that already names it: hidden from screen readers
  children?: React.ReactNode;
}) {
  if (hasFile(src)) {
    const blur = await blurFor(src!);
    return (
      <div className={['ph', 'has-img', ratio, className].filter(Boolean).join(' ')}>
        <Image
          src={src!}
          alt={decorative ? '' : alt}
          fill
          sizes={sizes}
          preload={priority}
          className="ph-img"
          {...(blur ? { placeholder: 'blur' as const, blurDataURL: blur } : {})}
        />
        {children}
      </div>
    );
  }
  const toneClass = tone === 'teal' ? '' : tone;
  const objClass = obj === 'default' ? 'obj' : `obj obj-${obj}`;
  return (
    <div className={['ph', toneClass, ratio, className].filter(Boolean).join(' ')} {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': alt })}>
      <span className={objClass} />
      {children}
    </div>
  );
}

export { hasFile as publicFileExists };
