'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import Logo from './Logo';
import { NAV, isGroup } from '@/lib/nav';
import { SITE } from '@/lib/site';

// Sticky header from the Nav artboard. Dropdowns open on click; opened from the keyboard,
// focus moves into the panel. Escape closes and returns focus to the trigger. Under 1024px it
// collapses to the logo and a menu button; the open menu makes the page behind inert.
export default function Nav({ media }: { media?: Record<string, React.ReactNode> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const viaKeyboard = useRef(false);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  // Keyboard-opened dropdown: move focus to its first link.
  useEffect(() => {
    if (open && viaKeyboard.current) panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    viaKeyboard.current = false;
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen((current) => {
        if (current) triggers.current[current]?.focus();
        return null;
      });
      setMobile((m) => {
        if (m) menuBtn.current?.focus();
        return false;
      });
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  // Mobile menu behaves as an overlay: page behind is inert and does not scroll.
  useEffect(() => {
    const behind = document.querySelectorAll<HTMLElement>('main, footer, .m-cta');
    behind.forEach((el) => (mobile ? el.setAttribute('inert', '') : el.removeAttribute('inert')));
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => {
      behind.forEach((el) => el.removeAttribute('inert'));
      document.body.style.overflow = '';
    };
  }, [mobile]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const group = NAV.find((n) => isGroup(n) && n.label === open);

  return (
    <header className="nav" ref={ref}>
      <a className="skip" href="#main">Skip to content</a>
      <div className="wrap nav-bar">
        <Logo />
        <nav aria-label="Main">
          <ul className="nav-links">
            {NAV.map((n) =>
              isGroup(n) ? (
                <li key={n.label}>
                  <button
                    type="button"
                    ref={(el) => { triggers.current[n.label] = el; }}
                    aria-expanded={open === n.label}
                    aria-controls="nav-panel"
                    className={[open === n.label && 'is-open', n.items.some((i) => active(i.href)) && 'is-active'].filter(Boolean).join(' ')}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') viaKeyboard.current = true; if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(n.label); } }}
                    onClick={() => setOpen(open === n.label ? null : n.label)}
                  >
                    {n.label}
                    <Icon name="chevron" />
                  </button>
                </li>
              ) : (
                <li key={n.href}>
                  <Link href={n.href} className={active(n.href) ? 'is-active' : undefined} aria-current={active(n.href) ? 'page' : undefined}>
                    {n.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
        <div className="nav-right">
          <Link className="nav-login" href={SITE.memberLoginUrl} prefetch={false}>Member Login</Link>
          <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
          <button
            type="button"
            ref={menuBtn}
            className="nav-menu"
            aria-expanded={mobile}
            aria-controls="mobile-nav"
            aria-label={mobile ? 'Close menu' : 'Open menu'}
            onClick={() => setMobile(!mobile)}
          >
            <Icon name={mobile ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {group && isGroup(group) && (
        <div className="mega" id="nav-panel" key={group.label} ref={panelRef} aria-label={`${group.label} menu`} role="region">
          <div className="wrap mega-inner">
            <div className="mega-main">
              <ul className={`mega-items cols-${group.items.length === 4 ? 2 : 3}`}>
                {group.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} prefetch={false} className="m-item" aria-current={active(i.href) ? 'page' : undefined}>
                      <span className="m-ic">{i.icon && <Icon name={i.icon} />}</span>
                      <span className="stack" style={{ gap: 4 }}>
                        <span className="m-title">{i.label}<Icon name="arrow" className="ic m-arrow" /></span>
                        <span className="m-text">{i.blurb}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mega-foot">
                <Link href={group.all.href} prefetch={false} className="btn btn-ghost">{group.all.label}<Icon name="arrow" /></Link>
                <span className="sm">Questions? <a href={`mailto:${SITE.email.hello}`}>{SITE.email.hello}</a></span>
              </div>
            </div>
            <Link href={group.featured.href} prefetch={false} className="m-feat">
              {media?.[group.label]}
              <span className="stack" style={{ gap: 6 }}>
                <span className="m-feat-title">{group.featured.title}</span>
                <span className="m-text">{group.featured.text}</span>
              </span>
              <span className={`btn ${group.featured.primary ? 'btn-primary' : 'btn-secondary'} m-feat-cta`}>{group.featured.cta}</span>
            </Link>
          </div>
        </div>
      )}

      {mobile && (
        <nav className="mnav" id="mobile-nav" aria-label="Mobile">
          {NAV.map((n) =>
            isGroup(n) ? (
              <div key={n.label}>
                <p className="foot-h mnav-h">{n.label}</p>
                <ul>
                  {n.items.map((i) => (
                    <li key={i.href}>
                      <Link href={i.href} prefetch={false}>{i.label}<Icon name="arrow" /></Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul key={n.href}>
                <li>
                  <Link href={n.href} prefetch={false}>{n.label}<Icon name="arrow" /></Link>
                </li>
              </ul>
            )
          )}
          <div className="stack" style={{ gap: 12 }}>
            <Link className="btn btn-primary btn-block" href="/get-a-quote">Get a Quote</Link>
            <Link className="btn btn-secondary btn-block" href={SITE.memberLoginUrl} prefetch={false}>Member Login</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
