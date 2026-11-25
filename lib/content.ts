import { getAllPosts } from './blog';

// Placeholder content index used by the sitemap and detail-page metadata.
// Swap these arrays for your CMS, MDX files or database when the real content is ready.

type Entry = { slug: string; title: string; description: string; updated: string };

export const caseStudies: Entry[] = [
  {
    slug: 'plant-based-sleeping-mask',
    title: 'Case study: plant-based sleeping mask launch visuals',
    description: 'How Behind CG built a packshot and lifestyle render set for a skincare launch: modelling from dielines, frosted glass lookdev, clay previews and final delivery.',
    updated: '2026-11-01',
  },
];

export const animations: Entry[] = [
  {
    slug: 'wireless-earbuds-launch-film',
    title: 'Wireless earbuds launch film: 3D animation',
    description: 'A 45-second 3D launch film for wireless earbuds with three social cut-downs, built in Blender and After Effects by Behind CG. Watch the film and the making-of.',
    updated: '2026-11-01',
  },
];

export const addons: Entry[] = [
  {
    slug: 'batch-render-pro',
    title: 'Batch Render Pro for Blender: queue and render many .blend files',
    description: 'Batch Render Pro queues several .blend files and renders them back to back, each with its own saved settings. Blender 4.2 LTS. Commercial licence and updates.',
    updated: '2026-11-01',
  },
  { slug: 'clay-render-pro', title: 'Clay Render Pro for Blender', description: 'Clay Render Pro gives any Blender scene a clean clay look for client previews without touching your materials. Commercial licence and updates.', updated: '2026-11-01' },
  { slug: 'smart-texture-loader', title: 'Smart Texture Loader for Blender', description: 'Smart Texture Loader reads a folder of PBR maps and builds a connected Blender material in one click. Commercial licence and updates.', updated: '2026-11-01' },
  { slug: 'simple-texture-baker', title: 'Simple Texture Baker for Blender', description: 'Simple Texture Baker bakes common maps in Blender from a panel of presets instead of hand-built bake setups. Commercial licence and updates.', updated: '2026-11-01' },
  { slug: 'drive-it', title: 'Drive it: one-click vehicle rig for Blender', description: 'Drive it adds a one-click vehicle rig to Blender for turntables and simple driving shots. Commercial licence and updates.', updated: '2026-11-01' },
];

export const courses: Entry[] = [
  {
    slug: 'product-visualization-masterclass',
    title: 'Product Visualization Masterclass in Blender',
    description: 'Learn the full product visualization workflow in Blender and Substance Painter: modelling, materials, studio lighting, rendering and delivery, with project files.',
    updated: '2026-11-01',
  },
];

// Blog entries come from content/blog/*.md.
export const posts: Entry[] = getAllPosts().map((p) => ({ slug: p.slug, title: p.title, description: p.description, updated: p.updated }));

export const findBySlug = (list: Entry[], slug: string) => list.find((e) => e.slug === slug);
