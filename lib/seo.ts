import type { Metadata } from 'next';
import { SITE, SITE_URL } from './site';

// One entry per route. `title` is the page part only: the layout adds " | Behind CG".
// Every title and description matches the page artboards on the design canvas.
export type PageMeta = {
  title: string;
  description: string;
  noindex?: boolean;
  changeFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
};

export const PAGES: Record<string, PageMeta> = {
  '/': { title: SITE.defaultTitle, description: SITE.defaultDescription, changeFrequency: 'weekly', priority: 1 },
  '/portfolio': {
    title: 'Portfolio: 3D product renders',
    description: 'Photoreal 3D product renders for beauty, tech, packaging, automotive and furniture brands. Browse stills, packshots and lifestyle scenes by category.',
    changeFrequency: 'weekly', priority: 0.9,
  },
  '/animations': {
    title: '3D product animations: launch films and social reels',
    description: '3D product animation by Behind CG: product ads, social reels, explainers and launch videos rendered in Blender and cut for every platform. Watch the showreel.',
    changeFrequency: 'weekly', priority: 0.9,
  },
  '/services': {
    title: 'Services: 3D visualization, animation, Blender addons and automation',
    description: 'Behind CG services: 3D product visualization, 3D product animation, custom Blender addon development and AI and social media automations. Get a fixed quote.',
    changeFrequency: 'monthly', priority: 0.9,
  },
  '/services/product-visualization': {
    title: '3D product visualization for e-commerce and ads',
    description: 'Photoreal 3D product renders from your CAD files or photos: marketplace packshots, lifestyle scenes, colour variants and detail shots. Fixed quotes from Behind CG.',
    changeFrequency: 'monthly', priority: 0.8,
  },
  '/services/product-animation': {
    title: '3D product animation for launches and social',
    description: '3D product launch films, social reels, turntables and explainers rendered in Blender and cut for YouTube, Reels, TikTok and product pages. Fixed quotes.',
    changeFrequency: 'monthly', priority: 0.8,
  },
  '/services/blender-addon-development': {
    title: 'Custom Blender addon development',
    description: 'Custom Blender addons and Python tools for studios: batch rendering, export automation, scene setup and studio panels, from the team behind Batch Render Pro.',
    changeFrequency: 'monthly', priority: 0.7,
  },
  '/services/ai-automation': {
    title: 'AI and social media automations with n8n',
    description: 'n8n workflows for creative teams: auto-posting to Instagram, TikTok and LinkedIn, render-to-reel and caption automation, and client intake into your CRM.',
    changeFrequency: 'monthly', priority: 0.7,
  },
  '/addons': {
    title: 'Blender addons for product artists',
    description: 'Blender addons that speed up product rendering: Batch Render Pro, Clay Render Pro, Smart Texture Loader and more. Commercial licence and updates included.',
    changeFrequency: 'weekly', priority: 0.9,
  },
  '/free-downloads': {
    title: 'Free Blender scene files and starter projects',
    description: 'Download free Blender product scenes, studio lighting starters and gobo samples from Behind CG. Practise product visualization with real studio setups.',
    changeFrequency: 'monthly', priority: 0.8,
  },
  '/courses': {
    title: 'Blender product visualization courses',
    description: 'Project-based Blender and Substance Painter courses for product visualization: modelling, lighting, materials and animation. Start with the free 4-episode series.',
    changeFrequency: 'monthly', priority: 0.8,
  },
  '/membership': {
    title: 'Membership: Basic and Pro plans for 3D artists',
    description: 'Behind CG membership for Blender artists: monthly studio scene files, breakdown tutorials, courses and member pricing on addons. Compare Basic and Pro.',
    changeFrequency: 'monthly', priority: 0.8,
  },
  '/blog': {
    title: 'Blog: Blender tutorials, breakdowns and product CGI guides',
    description: 'Lighting tutorials, project breakdowns and practical guides on product CGI for Blender artists and the brands who hire them.',
    changeFrequency: 'weekly', priority: 0.7,
  },
  '/about': {
    title: 'About Behind CG: a 3D product visualization studio',
    description: 'Behind CG is a remote 3D studio making product renders and animations for brands, and Blender addons, scene files and courses for artists.',
    changeFrequency: 'yearly', priority: 0.6,
  },
  '/get-a-quote': {
    title: 'Get a Quote for 3D product renders and animation',
    description: 'Tell us about your product and launch date. Behind CG replies with a plan and a quote for 3D renders or animation within two working days.',
    changeFrequency: 'yearly', priority: 0.9,
  },
  '/faq': {
    title: 'FAQ and support: projects, addons, courses, refunds',
    description: 'Answers on render pricing and timelines, Blender addon licences and installation, courses, membership, downloads and refunds. Contact support if you are stuck.',
    changeFrequency: 'monthly', priority: 0.5,
  },
  '/licenses': {
    title: 'Licences for Blender addons, scene files and courses',
    description: 'Personal and Studio licences for Behind CG Blender addons, plus usage terms for scene files, free downloads, courses and client renders.',
    changeFrequency: 'yearly', priority: 0.3,
  },
  '/privacy': {
    title: 'Privacy policy',
    description: 'How Behind CG collects, uses and protects your data, which cookies we set, and how to access or delete your information.',
    changeFrequency: 'yearly', priority: 0.2,
  },
  '/terms': {
    title: 'Terms and refunds',
    description: 'Terms for Behind CG client projects, digital products and membership, including payment, usage rights and the refund policy.',
    changeFrequency: 'yearly', priority: 0.2,
  },
  '/thank-you': {
    title: 'Thanks, your quote request is in',
    description: 'Your quote request has reached Behind CG. We reply within two working days.',
    noindex: true,
  },
};

// Next.js replaces (not merges) openGraph and twitter objects set by a page, so every
// page repeats these shared fields. A route's own opengraph-image file still wins
// over the default image below.
const DEFAULT_OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'Behind CG: 3D renders for product brands' };

const share = (
  title: string,
  description: string,
  url: string,
  type: 'website' | 'article' = 'website',
  image = DEFAULT_OG_IMAGE
) => ({
  openGraph: { type, siteName: SITE.name, locale: SITE.locale, title, description, url, images: [image] },
  twitter: { card: 'summary_large_image' as const, title, description, images: [image.url] },
});

/**
 * Build page metadata from the table above.
 * Usage in app/portfolio/page.tsx:  export const metadata = pageMetadata('/portfolio');
 */
export function pageMetadata(path: keyof typeof PAGES): Metadata {
  const p = PAGES[path];
  const isHome = path === '/';
  return {
    title: isHome ? { absolute: p.title } : p.title,
    description: p.description,
    alternates: { canonical: path },
    ...share(p.title, p.description, path),
    robots: p.noindex ? { index: false, follow: true } : undefined,
  };
}

/**
 * Metadata for detail pages (case study, animation, addon, course, article).
 * Set ownImage when the route folder has its own opengraph-image.tsx, so shares use it
 * instead of the site default.
 *
 * export async function generateMetadata({ params }) {
 *   const { slug } = await params;
 *   const post = findBySlug(posts, slug);
 *   return detailMetadata({ path: `/blog/${slug}`, title: post.title, description: post.description, article: true, ownImage: true });
 * }
 */
export function detailMetadata(opts: {
  path: string;
  title: string;
  description: string;
  article?: boolean;
  ownImage?: boolean;
}): Metadata {
  const image = opts.ownImage
    ? { url: `${opts.path}/opengraph-image`, width: 1200, height: 630, alt: opts.title }
    : DEFAULT_OG_IMAGE;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    ...share(opts.title, opts.description, opts.path, opts.article ? 'article' : 'website', image),
  };
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;
