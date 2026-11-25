import { renderOg, ogContentType, ogSize } from '@/lib/og';
import { findBySlug, animations } from '@/lib/content';

export const alt = 'Behind CG: 3D product animation';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return animations.map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = findBySlug(animations, slug);
  return renderOg({ kicker: '3D product animation', title: e?.title.split(':')[0] ?? 'Behind CG', foot: 'Visualize your products' });
}
