import { renderOg, ogContentType, ogSize } from '@/lib/og';

// Default social image for the site. Next.js also uses it for Twitter/X when
// no twitter-image file exists. Add the same file inside any route folder to override it.
export const alt = 'Behind CG: scroll-stopping 3D renders for product brands';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    kicker: '3D product visualization studio',
    title: 'Scroll-stopping 3D renders for product brands',
  });
}
