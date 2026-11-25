import { renderOg, ogContentType, ogSize } from '@/lib/og';
import { findBySlug, courses } from '@/lib/content';

export const alt = 'Behind CG: Blender course';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return courses.map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = findBySlug(courses, slug);
  return renderOg({ kicker: 'Blender course', title: e?.title.split(':')[0] ?? 'Behind CG', foot: 'Project files included' });
}
