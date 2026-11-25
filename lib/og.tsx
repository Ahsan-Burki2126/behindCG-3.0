import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { LOGO_COLORS as LC, LOGO_PATHS as LP, LOGO_VIEWBOX } from './logo';

// Shared 1200x630 Open Graph template, matching the BrandAssets artboard.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

type OgProps = {
  kicker: string; // small teal line above the title, e.g. "Blender addon"
  title: string; // page headline
  foot?: string; // bottom-right text, e.g. "From $49"
  imageSrc?: string; // optional absolute URL of a real render shown on the right
};

// Fonts ship in /assets/fonts (OFL, static .woff because the image renderer reads
// neither .woff2 nor variable fonts). If they are missing the image still renders with a default font.
async function loadFonts() {
  try {
    const dir = join(process.cwd(), 'assets/fonts');
    const [heading, body] = await Promise.all([
      readFile(join(dir, 'Montserrat-ExtraBold.woff')),
      readFile(join(dir, 'Raleway-SemiBold.woff')),
    ]);
    return [
      { name: 'Montserrat', data: heading, weight: 800 as const, style: 'normal' as const },
      { name: 'Raleway', data: body, weight: 600 as const, style: 'normal' as const },
    ];
  } catch {
    return undefined;
  }
}

const Mark = ({ width }: { width: number }) => (
  <svg width={width} height={Math.round((width * 875) / 1255)} viewBox={LOGO_VIEWBOX.mark}>
    <path d={LP.swoosh} fill={LC.bright} />
    <path d={LP.band} fill={LC.bright} />
    <path d={LP.bar} fill={LC.bright} />
    <path d={LP.c} fill={LC.teal} />
    <path d={LP.g} fill={LC.orange} />
  </svg>
);

export async function renderOg({ kicker, title, foot = 'Visualize your products', imageSrc }: OgProps) {
  const fonts = await loadFonts();
  const titleSize = title.length > 48 ? 52 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630, display: 'flex', position: 'relative', fontFamily: 'Raleway',
          backgroundColor: '#061617',
          // teal glow behind the render
          backgroundImage: 'radial-gradient(circle at 75% 40%, rgba(14,193,179,0.32) 0%, rgba(0,132,132,0.12) 28%, rgba(6,22,23,0) 52%)',
        }}
      >
        {/* render, or a large mark when no render is given */}
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} width={360} height={420} style={{ position: 'absolute', right: 120, top: 120, borderRadius: 24, objectFit: 'cover' }} alt="" />
        ) : (
          <div style={{ position: 'absolute', right: 100, top: 170, width: 400, height: 279, display: 'flex' }}>
            <Mark width={400} />
            {/* The renderer cannot draw SVG text, so BEHIND is laid over the mark (scaled from the logo's 1600px artwork). */}
            <div style={{ position: 'absolute', left: 202, top: 63, width: 170, display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat', fontSize: 40, fontWeight: 800, lineHeight: 1, color: LC.orange }}>
              {'BEHIND'.split('').map((ch, i) => <span key={i}>{ch}</span>)}
            </div>
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 630, padding: '64px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Mark width={72} />
            <div style={{ display: 'flex', fontWeight: 600, fontSize: 28, letterSpacing: -0.5, color: '#fff' }}>
              Behind<span style={{ color: '#0EC1B3', marginLeft: 8 }}>CG</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 580 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#0EC1B3' }}>{kicker}</div>
            <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: titleSize, lineHeight: 1.08, letterSpacing: -1.5, color: '#fff' }}>{title}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#9DB4B3' }}>
            <span>behindcg.com</span>
            <span>{foot}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, backgroundImage: 'linear-gradient(90deg, #008484, #0EC1B3 60%, #FF8F3B)' }} />
      </div>
    ),
    { ...ogSize, fonts }
  );
}
