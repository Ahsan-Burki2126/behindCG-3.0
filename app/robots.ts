import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Served at /robots.txt
export default function robots(): MetadataRoute.Robots {
  // Keep staging copies out of search results: set NEXT_PUBLIC_NOINDEX=1 on any non-live
  // deployment (for example a Hostinger staging subdomain).
  if (process.env.NEXT_PUBLIC_NOINDEX === '1' || (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production')) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account', '/learn/', '/auth/', '/sign-in', '/welcome', '/thank-you'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
