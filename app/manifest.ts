import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// Served at /manifest.webmanifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#061617',
    theme_color: SITE.themeColor,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
