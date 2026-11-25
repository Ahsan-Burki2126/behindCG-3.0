import type { Metadata } from 'next';
import Link from 'next/link';

// Custom 404, matching the NotFound artboard. Next.js serves it with a 404 status.
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This page does not exist. Find renders, Blender addons and courses from Behind CG.',
  robots: { index: false, follow: true },
};

const links = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/animations', label: '3D animations' },
  { href: '/addons', label: 'Blender addons' },
  { href: '/courses', label: 'Courses' },
  { href: '/faq', label: 'FAQ and support' },
];

export default function NotFound() {
  return (
    <main id="main">
      <section style={{ padding: '120px 0' }}>
        <div className="wrap nf">
          <div className="stack" style={{ gap: 24, alignItems: 'flex-start' }}>
            <p className="code" aria-hidden="true">404</p>
            <h1 className="h1">This page is out of frame</h1>
            <p className="lead">The link may be old, or the page has moved. Try one of these instead.</p>
            <div className="row">
              <Link className="btn btn-primary" href="/">Go to home</Link>
              <Link className="btn btn-secondary" href="/get-a-quote">Get a Quote</Link>
            </div>
          </div>
          <nav className="nf-links" aria-label="Popular pages">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
