// Site-wide constants. Replace the placeholders before launch.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://behindcg.com').replace(/\/$/, '');

export const SITE = {
  name: 'Behind CG',
  tagline: 'Visualize your products',
  defaultTitle: 'Behind CG | 3D product renders and animations for brands',
  defaultDescription:
    'Photoreal 3D product renders and animations for brands, plus Blender addons, scene files and courses for artists. Get a quote in two working days.',
  locale: 'en_US',
  themeColor: '#061617',
  // Contact: email + quote form only. No street address or city on the site (owner's decision).
  email: {
    hello: 'hello@behindcg.com', // [replace]
    support: 'support@behindcg.com', // [replace]
    privacy: 'privacy@behindcg.com', // [replace]
  },
  // Members area. Commerce and membership tooling are not chosen yet. [replace]
  memberLoginUrl: '/sign-in',
  social: {
    youtube: 'https://www.youtube.com/@[handle]', // [replace]
    instagram: 'https://www.instagram.com/[handle]', // [replace]
    linkedin: 'https://www.linkedin.com/company/[handle]', // [replace]
    tiktok: 'https://www.tiktok.com/@[handle]', // [replace]
    facebook: 'https://www.facebook.com/[handle]', // [replace]
    patreon: 'https://www.patreon.com/[handle]', // [replace]
  },
} as const;
