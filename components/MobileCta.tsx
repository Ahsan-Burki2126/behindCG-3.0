'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Sticky mobile call-to-action (shown under 720px by CSS). It appears only after the visitor
// scrolls past the first screen (so it never duplicates the hero buttons), is skipped on pages
// where it would cover a form, and its second action fits the section of the site.
const HIDDEN_ON = ['/get-a-quote', '/thank-you', '/sign-in', '/account'];

export default function MobileCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`)) || pathname.startsWith('/learn')) return null;

  const artists = ['/addons', '/free-downloads', '/courses', '/membership', '/blog'].some((p) => pathname.startsWith(p));
  const second = artists
    ? pathname.startsWith('/courses')
      ? { href: '/membership', label: 'See membership' }
      : { href: '/free-downloads', label: 'Free scene files' }
    : { href: '/portfolio', label: 'See the work' };

  return (
    <nav className={`m-cta${visible ? ' is-visible' : ''}`} aria-label="Quick actions" aria-hidden={!visible} inert={!visible || undefined}>
      <Link className="btn btn-primary" href="/get-a-quote" prefetch={false}>Get a Quote</Link>
      <Link className="btn btn-secondary" href={second.href} prefetch={false}>{second.label}</Link>
    </nav>
  );
}
