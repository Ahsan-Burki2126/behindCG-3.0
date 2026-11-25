import type { NextConfig } from 'next';

// Hosts that pages may load from. Add your video or file CDN here if you use one
// (for example a Bunny or Cloudflare R2 domain) via NEXT_PUBLIC_MEDIA_HOST.
const analyticsHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_ANALYTICS_SRC ? new URL(process.env.NEXT_PUBLIC_ANALYTICS_SRC).origin : '';
  } catch {
    return '';
  }
})();
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOST ?? '';

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' is needed for Next.js's inline bootstrap scripts on static pages;
  // 'wasm-unsafe-eval' lets the self-hosted Draco decoder run for 3D models.
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${process.env.NODE_ENV === 'production' ? '' : "'unsafe-eval'"} ${analyticsHost}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://i.ytimg.com https://i.vimeocdn.com ${mediaHost}`,
  "font-src 'self'",
  `connect-src 'self' blob: data: ${analyticsHost} ${mediaHost}`,
  `media-src 'self' blob: ${mediaHost}`,
  'frame-src https://www.youtube-nocookie.com https://player.vimeo.com',
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
]
  .map((d) => d.replace(/\s+/g, ' ').trim())
  .join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The OG image template reads the fonts in /assets/fonts at request time.
  outputFileTracingIncludes: { '/**/opengraph-image': ['./assets/fonts/**'] },
  images: {
    // WebP only: AVIF encoding is several times more CPU-heavy, which matters on shared
    // Node hosting where every deploy starts with an empty image cache.
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // resized images are cached for 30 days
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
    imageSizes: [256, 384],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Fingerprint-free static assets: long cache, revalidated by filename changes on redeploy.
      { source: '/models/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
      { source: '/decoders/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
    ];
  },
};

export default nextConfig;
