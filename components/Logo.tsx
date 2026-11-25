import Link from 'next/link';
import { LOGO_COLORS as C, LOGO_PATHS as P, LOGO_TAGLINE as T, LOGO_VIEWBOX, LOGO_WORD as W } from '@/lib/logo';

// The Behind CG logo as inline SVG, so it stays sharp and uses the page's own font for
// BEHIND. `full` adds the "Visualize your products" tagline (footer); the header uses the mark.
export function LogoArt({ full = false, className }: { full?: boolean; className?: string }) {
  return (
    <svg className={className} viewBox={full ? LOGO_VIEWBOX.full : LOGO_VIEWBOX.mark} aria-hidden="true" focusable="false">
      <path d={P.swoosh} fill={C.bright} />
      <path d={P.band} fill={C.bright} />
      <path d={P.bar} fill={C.bright} />
      <path d={P.c} fill={C.teal} />
      <path d={P.g} fill={C.orange} />
      <text
        x={W.x}
        y={W.y}
        textLength={W.width}
        lengthAdjust="spacingAndGlyphs"
        fill={C.orange}
        style={{ font: `800 ${W.size}px var(--font-heading), Arial, sans-serif` }}
      >
        BEHIND
      </text>
      {full && (
        <text
          x={T.x}
          y={T.y}
          textLength={T.width}
          lengthAdjust="spacing"
          fill={C.bright}
          style={{ font: `700 ${T.size}px var(--font-heading), Arial, sans-serif` }}
        >
          VISUALIZE YOUR PRODUCTS
        </text>
      )}
    </svg>
  );
}

export default function Logo({ full = false }: { full?: boolean }) {
  return (
    <Link href="/" className={`logo${full ? ' logo-full' : ''}`} aria-label="Behind CG home">
      <LogoArt full={full} className="logo-art" />
    </Link>
  );
}
