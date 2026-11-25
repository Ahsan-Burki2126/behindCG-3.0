import Script from 'next/script';

// Privacy-friendly, cookieless analytics that work on any host (Hostinger included).
// Off until configured. Set in .env / Hostinger environment variables:
//
//   Umami:      NEXT_PUBLIC_ANALYTICS=umami
//               NEXT_PUBLIC_ANALYTICS_SRC=https://cloud.umami.is/script.js
//               NEXT_PUBLIC_ANALYTICS_ID=<website id>
//   Plausible:  NEXT_PUBLIC_ANALYTICS=plausible
//               NEXT_PUBLIC_ANALYTICS_SRC=https://plausible.io/js/script.js
//               NEXT_PUBLIC_ANALYTICS_ID=behindcg.com
//
// Neither sets cookies, so no consent is needed. The script host is added to the
// Content-Security-Policy automatically (next.config.ts).
export default function Analytics() {
  const kind = process.env.NEXT_PUBLIC_ANALYTICS;
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  const id = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  if (!kind || !src || !id) return null;
  if (kind === 'umami') return <Script defer src={src} data-website-id={id} strategy="afterInteractive" />;
  if (kind === 'plausible') return <Script defer src={src} data-domain={id} strategy="afterInteractive" />;
  return null;
}
