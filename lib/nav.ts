import type { IconName } from '@/components/Icon';

// Site navigation, shared by the header, mobile menu and footer.
export type NavLink = { href: string; label: string; blurb?: string; icon?: IconName };
export type NavGroup = {
  label: string;
  layout: 'mega' | 'list';
  items: NavLink[];
  all: { href: string; label: string };
  // Featured card on the right of the dropdown. Its image is passed in from the layout.
  featured: { title: string; text: string; href: string; cta: string; primary?: boolean };
};

export const NAV: (NavGroup | NavLink)[] = [
  {
    label: 'Work',
    layout: 'list',
    all: { href: '/portfolio', label: 'View all work' },
    featured: { title: 'Case study: sleeping mask launch', text: 'Launch renders built from dielines before the first sample existed.', href: '/portfolio/plant-based-sleeping-mask', cta: 'Read the case study' },
    items: [
      { href: '/portfolio', label: 'Portfolio', blurb: 'Stills, packshots and lifestyle renders by category.', icon: 'image' },
      { href: '/animations', label: '3D animations', blurb: 'Launch films, social reels and turntables.', icon: 'film' },
      { href: '/portfolio/plant-based-sleeping-mask', label: 'Sleeping mask case study', blurb: 'A skincare launch from dieline to final render.', icon: 'layers' },
    ],
  },
  {
    label: 'Services',
    layout: 'mega',
    all: { href: '/services', label: 'Compare all services' },
    featured: { title: 'Get a fixed quote', text: 'Send the product and your launch date. You get a plan and a price within two working days.', href: '/get-a-quote', cta: 'Get a Quote', primary: true },
    items: [
      { href: '/services/product-visualization', label: 'Product visualization', blurb: 'Packshots, lifestyle scenes and colour variants for stores and ads.', icon: 'image' },
      { href: '/services/product-animation', label: 'Product animation', blurb: 'Launch films and social cut-downs rendered in Blender.', icon: 'film' },
      { href: '/services/blender-addon-development', label: 'Blender addon development', blurb: 'Custom Python tools and panels for studios.', icon: 'code' },
      { href: '/services/ai-automation', label: 'AI and social automation', blurb: 'n8n workflows for posting, captions and client intake.', icon: 'flow' },
    ],
  },
  {
    label: 'Products',
    layout: 'list',
    all: { href: '/addons', label: 'Browse all addons' },
    featured: { title: 'Batch Render Pro', text: 'Queue many .blend files and let them render overnight, each with its own settings.', href: '/addons/batch-render-pro', cta: 'See Batch Render Pro' },
    items: [
      { href: '/addons', label: 'Blender addons', blurb: 'Batch Render Pro, Clay Render Pro and more.', icon: 'puzzle' },
      { href: '/free-downloads', label: 'Free downloads', blurb: 'Scene files and studio lighting starters.', icon: 'download' },
      { href: '/licenses', label: 'Licences', blurb: 'Personal and Studio terms in plain words.', icon: 'file' },
    ],
  },
  {
    label: 'Learn',
    layout: 'list',
    all: { href: '/courses', label: 'All courses' },
    featured: { title: 'Free 3D Product Visualization Series', text: 'Four episodes on YouTube, from reference photos to a finished render.', href: '/courses', cta: 'Start the free series' },
    items: [
      { href: '/courses', label: 'Courses', blurb: 'Project-based product visualization in Blender.', icon: 'book' },
      { href: '/blog', label: 'Blog', blurb: 'Lighting tutorials and project breakdowns.', icon: 'pen' },
      { href: '/faq', label: 'FAQ and support', blurb: 'Licences, installs, refunds and projects.', icon: 'help' },
    ],
  },
  { href: '/membership', label: 'Membership' },
  { href: '/about', label: 'About' },
];

export const isGroup = (n: NavGroup | NavLink): n is NavGroup => 'items' in n;

export const FOOTER: { heading: string; links: NavLink[] }[] = [
  {
    heading: 'Studio',
    links: [
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/animations', label: '3D animations' },
      { href: '/services', label: 'Services' },
      { href: '/get-a-quote', label: 'Get a Quote' },
    ],
  },
  {
    heading: 'Products',
    links: [
      { href: '/addons', label: 'Blender addons' },
      { href: '/free-downloads', label: 'Free downloads' },
      { href: '/membership', label: 'Membership' },
      { href: '/licenses', label: 'Licences' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { href: '/courses', label: 'Courses' },
      { href: '/blog', label: 'Blog' },
      { href: '/faq', label: 'FAQ and support' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/get-a-quote', label: 'Contact' },
    ],
  },
];
