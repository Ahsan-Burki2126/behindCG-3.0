import type { MetadataRoute } from 'next';
import { PAGES, absoluteUrl } from '@/lib/seo';
import { addons, animations, caseStudies, courses, posts } from '@/lib/content';

// Served at /sitemap.xml
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = Object.entries(PAGES)
    .filter(([, meta]) => !meta.noindex)
    .map(([path, meta]) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: meta.changeFrequency,
      priority: meta.priority,
    }));

  const detail = (base: string, list: { slug: string; updated: string }[], priority: number) =>
    list.map((e) => ({
      url: absoluteUrl(`${base}/${e.slug}`),
      lastModified: new Date(e.updated),
      changeFrequency: 'monthly' as const,
      priority,
    }));

  return [
    ...staticRoutes,
    ...detail('/portfolio', caseStudies, 0.7),
    ...detail('/animations', animations, 0.7),
    ...detail('/addons', addons, 0.8),
    ...detail('/courses', courses, 0.7),
    ...detail('/blog', posts, 0.6),
  ];
}
