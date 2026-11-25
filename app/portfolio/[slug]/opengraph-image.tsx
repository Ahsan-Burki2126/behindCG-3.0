import { renderOg, ogContentType, ogSize } from '@/lib/og';
import { findBySlug, caseStudies } from '@/lib/content';

export const alt = 'Behind CG: Case study';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return caseStudies.map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = findBySlug(caseStudies, slug);
  return renderOg({ kicker: 'Case study', title: e?.title.split(':')[0] ?? 'Behind CG', foot: 'Visualize your products' });
}
