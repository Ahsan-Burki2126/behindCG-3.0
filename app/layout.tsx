import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Montserrat, Raleway } from 'next/font/google';
import Analytics from '@/components/Analytics';
import CookieBanner from '@/components/CookieBanner';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import MotionLoader from '@/components/MotionLoader';
import Nav from '@/components/Nav';
import Render from '@/components/Render';
import { organization, website } from '@/lib/jsonld';
import { SITE, SITE_URL } from '@/lib/site';
import './globals.css';

// Montserrat for headings (matches the logo lettering), Raleway for body text,
// JetBrains Mono for small technical text: durations, dates, labels, badges, step numbers, code.
const heading = Montserrat({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
// Italic is used in three places only (home hero accent, marquee, 404): not preloaded.
const headingItalic = Montserrat({ subsets: ['latin'], style: 'italic', variable: '--font-heading-italic', display: 'swap', preload: false });
const body = Raleway({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.defaultTitle, template: `%s | ${SITE.name}` },
  description: SITE.defaultDescription,
  applicationName: SITE.name,
  // No canonical or og:url here: a page without its own metadata must not claim to be the home page.
  // Each page sets them through pageMetadata() or detailMetadata() in lib/seo.ts.
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  // Icons come from the files in /app: icon.svg, favicon.ico, apple-icon.png.
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: 'dark',
};

// Images for the featured card in each nav dropdown (same slots as the pages they link to).
const navMedia = {
  Work: <Render decorative src="/images/work/plant-based-sleeping-mask.jpg" ratio="r169" tone="cool" obj="jar" alt="" sizes="340px" />,
  Services: <Render decorative src="/images/home/for-brands.jpg" ratio="r169" tone="warm" obj="can" alt="" sizes="340px" />,
  Products: <Render decorative src="/images/addons/batch-render-pro.jpg" ratio="r169" tone="wire" obj="box" alt="" sizes="340px" />,
  Learn: <Render decorative src="/images/home/learn.jpg" ratio="r169" tone="clay" obj="jar" alt="" sizes="340px" />,
};

// Runs before first paint: turns on motion pre-states unless the visitor prefers reduced
// motion, and removes them after 6s if the motion script never starts (content stays visible).
const motionFlag = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('motion');setTimeout(function(){if(!window.__bcgMotion)d.classList.remove('motion')},6000)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${headingItalic.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
        <JsonLd data={[organization(), website()]} />
      </head>
      <body className="bcg">
        <Nav media={navMedia} />
        <CookieBanner />
        {children}
        <Footer />
        <MotionLoader />
        <Analytics />
      </body>
    </html>
  );
}
