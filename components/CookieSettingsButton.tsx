'use client';

import { openCookieSettings } from './CookieBanner';

export default function CookieSettingsButton() {
  return (
    <button type="button" className="link-btn" onClick={openCookieSettings}>
      Cookie settings
    </button>
  );
}
