import { SITE, SITE_URL } from './site';
import { absoluteUrl } from './seo';

// schema.org builders. Prices are only included once they are real (no brackets).
const isReal = (v?: string) => !!v && !/[[\]]/.test(v);
const priceNumber = (v: string) => v.replace(/[^0-9.]/g, '');

const socialLinks = () => Object.values(SITE.social).filter((u) => !u.includes('['));

export const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  slogan: SITE.tagline,
  email: SITE.email.hello,
  ...(socialLinks().length ? { sameAs: socialLinks() } : {}),
});

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE_URL,
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});

export const softwareProduct = (p: { name: string; description: string; path: string; price: string; image?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: p.name,
  description: p.description,
  url: absoluteUrl(p.path),
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Windows, macOS, Linux (Blender)',
  ...(p.image ? { image: absoluteUrl(p.image) } : {}),
  ...(isReal(p.price)
    ? { offers: { '@type': 'Offer', price: priceNumber(p.price), priceCurrency: 'USD', url: absoluteUrl(p.path), availability: 'https://schema.org/InStock' } }
    : {}),
});

export const course = (c: { name: string; description: string; path: string; price: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: c.name,
  description: c.description,
  url: absoluteUrl(c.path),
  provider: { '@type': 'Organization', name: SITE.name, sameAs: SITE_URL },
  ...(isReal(c.price) ? { offers: { '@type': 'Offer', category: 'Paid', price: priceNumber(c.price), priceCurrency: 'USD' } } : {}),
});

export const article = (a: { title: string; description: string; path: string; date?: string; image?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: a.title,
  description: a.description,
  url: absoluteUrl(a.path),
  mainEntityOfPage: absoluteUrl(a.path),
  ...(a.date && isReal(a.date) ? { datePublished: a.date } : {}),
  image: absoluteUrl(a.image ?? `${a.path}/opengraph-image`),
  author: { '@type': 'Organization', name: SITE.name, url: SITE_URL },
  publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` } },
});

export const service = (s: { name: string; description: string; path: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.name,
  description: s.description,
  url: absoluteUrl(s.path),
  provider: { '@type': 'Organization', name: SITE.name, url: SITE_URL },
  areaServed: 'Worldwide',
});

export const faqPage = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items
    .filter((i) => !i.a.includes('['))
    .map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
});

export const videoObject = (v: { name: string; description: string; thumbnail: string; embedUrl?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: v.name,
  description: v.description,
  thumbnailUrl: absoluteUrl(v.thumbnail),
  ...(v.embedUrl ? { embedUrl: v.embedUrl } : {}),
});
