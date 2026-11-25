import { renderOg, ogContentType, ogSize } from '@/lib/og';
import { findBySlug, posts } from '@/lib/content';

// Per-article social image. Copy this file into app/addons/[slug], app/courses/[slug],
// app/portfolio/[slug] and app/animations/[slug], and change the list and kicker.
export const alt = 'Behind CG blog post';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findBySlug(posts, slug);
  return renderOg({
    kicker: 'Behind CG blog',
    title: post?.title ?? 'Notes from the studio',
    foot: 'Tutorials and breakdowns',
  });
}
