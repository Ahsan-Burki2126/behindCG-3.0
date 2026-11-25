import type { Obj, Tone } from '@/components/Render';
import type { Video } from '@/components/VideoPlayer';

// Image paths under /public. A missing file falls back to the render stand-in, so adding
// a real image is just saving it with this name (JPG, 1600px on the long side is plenty).
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const withImg = <T extends { title?: string; name?: string; slug?: string }>(dir: string, list: T[]) =>
  list.map((i) => ({ ...i, img: `/images/${dir}/${i.slug ?? slugify((i.title ?? i.name)!)}.jpg` }));

// Display data for cards and listing pages. Placeholder content the owner asked for:
// every bracketed value, render stand-in and "[confirm]" line is replaced with approved
// material before launch. Items with an href link to a detail page; the rest are stills only.

export type WorkItem = { img?: string; title: string; category: string; href?: string; tone: Tone; obj: Obj; alt: string };

export const WORK_CATEGORIES = ['Beauty', 'Tech', 'Packaging', 'Furniture', 'Automotive'];

export const WORK: WorkItem[] = withImg('work', [
  { title: 'Plant-based sleeping mask', category: 'Beauty', href: '/portfolio/plant-based-sleeping-mask', tone: 'cool', obj: 'jar', alt: 'Frosted glass skincare jar on a stone plinth under a soft key light' },
  { title: 'Wireless earbuds', category: 'Tech', href: '/animations/wireless-earbuds-launch-film', tone: 'teal', obj: 'round', alt: 'Charging case for wireless earbuds, lid open, on a dark studio floor' },
  { title: 'Sparkling water can', category: 'Packaging', tone: 'warm', obj: 'can', alt: 'Aluminium drinks can with condensation, lit from behind' },
  { title: 'Eau de parfum bottle', category: 'Beauty', tone: 'warm', obj: 'bottle', alt: 'Glass perfume bottle with a heavy base and gold cap' },
  { title: 'Gift box set', category: 'Packaging', tone: 'clay', obj: 'box', alt: 'Clay preview of a rigid gift box with a lifted lid' },
  { title: 'Smart speaker', category: 'Tech', tone: 'teal', obj: 'default', alt: 'Fabric-covered smart speaker on a reflective dark surface' },
  { title: 'Lounge chair', category: 'Furniture', tone: 'cool', obj: 'box', alt: 'Upholstered lounge chair in a bright room set' },
  { title: 'Alloy wheel', category: 'Automotive', tone: 'teal', obj: 'round', alt: 'Machined alloy wheel on a turntable with rim lighting' },
  { title: 'Serum dropper', category: 'Beauty', tone: 'cool', obj: 'bottle', alt: 'Amber glass serum bottle with a dropper cap' },
  { title: 'Table lamp', category: 'Furniture', tone: 'warm', obj: 'default', alt: 'Ceramic table lamp switched on beside a book' },
  { title: 'Protein tub', category: 'Packaging', tone: 'wire', obj: 'jar', alt: 'Wireframe of a supplement tub with a screw lid' },
  { title: 'Car key fob', category: 'Automotive', tone: 'teal', obj: 'can', alt: 'Car key fob on brushed metal, close detail' },
]);

export type Film = { video?: Video; img?: string; title: string; category: string; duration: string; href?: string; tone: Tone; obj: Obj; alt: string };

export const FILM_CATEGORIES = ['Launch films', 'Social reels', 'Turntables', 'Explainers'];

export const FILMS: Film[] = withImg('films', [
  { title: 'Wireless earbuds launch film', category: 'Launch films', duration: '[0:45]', href: '/animations/wireless-earbuds-launch-film', tone: 'teal', obj: 'round', alt: 'Earbuds case opening in slow motion' },
  { title: 'Serum bottle reveal', category: 'Social reels', duration: '[0:15]', tone: 'cool', obj: 'bottle', alt: 'Serum bottle rising out of liquid' },
  { title: 'Sparkling can pour', category: 'Social reels', duration: '[0:12]', tone: 'warm', obj: 'can', alt: 'Drinks can with bubbles bursting around it' },
  { title: 'Smart speaker turntable', category: 'Turntables', duration: '[0:20]', tone: 'teal', obj: 'default', alt: 'Smart speaker rotating on a dark plinth' },
  { title: 'Gift box unboxing', category: 'Explainers', duration: '[0:35]', tone: 'clay', obj: 'box', alt: 'Gift box lid lifting to show the products inside' },
  { title: 'Alloy wheel detail pass', category: 'Turntables', duration: '[0:18]', tone: 'cool', obj: 'round', alt: 'Camera sweeping across an alloy wheel' },
]);

export type AddonItem = { img?: string;
  slug: string;
  name: string;
  blurb: string;
  price: string;
  blender: string;
  badge?: { label: string; kind: 'b-orange' | 'b-teal' | 'b-brand' | 'b-outline' };
  tone: Tone;
  obj: Obj;
};

export const ADDONS: AddonItem[] = withImg('addons', [
  { slug: 'batch-render-pro', name: 'Batch Render Pro', blurb: 'Queue several .blend files and render them back to back, each with its own saved settings.', price: '$[00]', blender: '4.2+', badge: { label: 'On Superhive', kind: 'b-brand' }, tone: 'wire', obj: 'box' },
  { slug: 'clay-render-pro', name: 'Clay Render Pro', blurb: 'Clay previews of any scene for client sign-off, without touching your materials. [confirm]', price: '$[00]', blender: '4.2+', badge: { label: 'New', kind: 'b-orange' }, tone: 'clay', obj: 'bottle' },
  { slug: 'smart-texture-loader', name: 'Smart Texture Loader', blurb: 'Load a folder of PBR maps and get a wired-up material in one click. [confirm]', price: '$[00]', blender: '4.2+', tone: 'cool', obj: 'round' },
  { slug: 'simple-texture-baker', name: 'Simple Texture Baker', blurb: 'Bake maps from a panel of presets instead of rebuilding bake setups by hand. [confirm]', price: '$[00]', blender: '4.2+', tone: 'teal', obj: 'jar' },
  { slug: 'drive-it', name: 'Drive it', blurb: 'One-click vehicle rig for turntables and simple driving shots. [confirm]', price: '$[00]', blender: '4.2+', badge: { label: 'Beta', kind: 'b-outline' }, tone: 'warm', obj: 'can' },
]);

export type Download = { img?: string; title: string; text: string; format: string; size: string; url: string; tone: Tone; obj: Obj };

// url: '' renders a disabled button until the file is uploaded.
export const DOWNLOADS: Download[] = withImg('downloads', [
  { title: 'Studio product scene', text: 'A three-point product studio with a sweep, softboxes and a camera rig. Drop your model in and render.', format: '.blend', size: '[00] MB', url: '', tone: 'teal', obj: 'bottle' },
  { title: 'Glass lighting starter', text: 'Dark cards and strip lights set up for glass and liquid renders.', format: '.blend', size: '[00] MB', url: '', tone: 'cool', obj: 'jar' },
  { title: 'Gobo sample pack', text: 'Shadow gobos for window light and foliage patterns on product sets.', format: '.zip', size: '[00] MB', url: '', tone: 'warm', obj: 'box' },
]);

export const EPISODES = [
  { n: 1, title: 'Modelling the product from references', duration: '[00:00]' },
  { n: 2, title: 'Materials and labels', duration: '[00:00]' },
  { n: 3, title: 'Studio lighting', duration: '[00:00]' },
  { n: 4, title: 'Rendering and compositing', duration: '[00:00]' },
];

export type Course = { img?: string; slug?: string; title: string; text: string; level: string; lessons: string; price: string; status?: string; tone: Tone; obj: Obj };

export const COURSES: Course[] = withImg('courses', [
  { slug: 'product-visualization-masterclass', title: 'Product Visualization Masterclass', text: 'The full workflow in Blender and Substance Painter: modelling, materials, studio lighting, rendering and delivery.', level: 'Intermediate', lessons: '[00] lessons', price: '$[00]', tone: 'cool', obj: 'bottle' },
  { title: 'Product animation in Blender', text: 'Camera moves, reveals and turntables for product films, cut for social. [confirm]', level: 'Intermediate', lessons: '[00] lessons', price: '$[00]', status: 'Coming soon', tone: 'teal', obj: 'round' },
  { title: 'Lighting glass and liquids', text: 'Studio setups for glass, liquids and transparent packaging. [confirm]', level: 'Advanced', lessons: '[00] lessons', price: '$[00]', status: 'Coming soon', tone: 'warm', obj: 'can' },
]);

// Blog posts live in content/blog/*.md (see lib/blog.ts).


export type Plan = { name: string; price: string; period: string; text: string; perks: string[]; featured?: boolean };

// Basic and Pro perks and prices are not decided yet, nor how they relate to Patreon tiers.
export const PLANS: Plan[] = [
  {
    name: 'Basic',
    price: '$[00]',
    period: 'per month',
    text: 'For artists who want a steady supply of scenes to practise on.',
    perks: ['[Monthly studio scene file]', '[Breakdown tutorial each month]', '[Member discount on addons]', '[Community access]'],
  },
  {
    name: 'Pro',
    price: '$[00]',
    period: 'per month',
    text: 'For working artists who want every course and the full scene library.',
    perks: ['[Everything in Basic]', '[All courses included]', '[Full scene file archive]', '[Larger addon discount]', '[Monthly live Q&A]'],
    featured: true,
  },
];

export const PLAN_ROWS: { label: string; basic: string; pro: string }[] = [
  { label: 'New scene file each month', basic: '[Yes]', pro: '[Yes]' },
  { label: 'Scene file archive', basic: '[Last 3 months]', pro: '[Everything]' },
  { label: 'Breakdown tutorials', basic: '[Yes]', pro: '[Yes]' },
  { label: 'Courses', basic: '[Member price]', pro: '[Included]' },
  { label: 'Addon discount', basic: '[00]%', pro: '[00]%' },
  { label: 'Live Q&A', basic: '[No]', pro: '[Monthly]' },
];

// Studio showreel, used on the home page and the animations page.
// Set to { provider: 'youtube', id: 'VIDEO_ID' }, { provider: 'vimeo', id: '123456789' }
// or { provider: 'file', src: '/videos/showreel.mp4' } (keep files under ~40 MB, H.264).
export const SHOWREEL: Video = { provider: 'none' }; // [replace]
export const SHOWREEL_DURATION = '[1:30]';
