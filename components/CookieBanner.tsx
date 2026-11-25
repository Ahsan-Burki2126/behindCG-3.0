'use client';

import { useEffect, useState } from 'react';

// Cookie banner from the Footer artboard: bottom left, two equal choices, reopened by
// the "Cookie settings" button in the footer (call openCookieSettings()).
//
// Umami and Plausible (components/Analytics.tsx) are cookieless, so they run without consent. Gate anything that
// sets non-essential cookies (Meta Pixel, Hotjar, etc.) behind hasAnalyticsConsent().

const KEY = 'bcg-consent'; // 'all' | 'essential'
const EVENT = 'bcg:cookie-settings';

export function hasAnalyticsConsent() {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(KEY) === 'all';
  } catch {
    return false;
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(EVENT));
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
    const reopen = () => setOpen(true);
    window.addEventListener(EVENT, reopen);
    return () => window.removeEventListener(EVENT, reopen);
  }, []);

  const decide = (value: 'all' | 'essential') => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* storage blocked: the banner just closes for this visit */
    }
    setOpen(false);
    window.dispatchEvent(new CustomEvent('bcg:consent', { detail: value }));
  };

  if (!open) return null;

  return (
    <section className="cookie" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
      <h2 className="h5" id="cookie-title">Cookies on Behind CG</h2>
      <p className="sm">
        We use essential cookies to run the site and, with your consent, analytics cookies to see which pages help
        visitors. You can change this any time in Cookie settings.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" type="button" style={{ flex: 1 }} onClick={() => decide('essential')}>
          Reject non-essential
        </button>
        <button className="btn btn-secondary" type="button" style={{ flex: 1 }} onClick={() => decide('all')}>
          Accept all
        </button>
      </div>
    </section>
  );
}
