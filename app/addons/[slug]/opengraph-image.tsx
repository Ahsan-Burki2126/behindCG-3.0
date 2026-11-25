import { renderOg, ogContentType, ogSize } from '@/lib/og';
import { findBySlug, addons } from '@/lib/content';

export const alt = 'Behind CG: Blender addon';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return addons.map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = findBySlug(addons, slug);
  return renderOg({ kicker: 'Blender addon', title: e?.title.split(':')[0] ?? 'Behind CG', foot: 'Commercial licence included' });
}
