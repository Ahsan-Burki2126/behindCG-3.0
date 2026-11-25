import { siFacebook, siInstagram, siPatreon, siTiktok, siYoutube } from 'simple-icons';

// Brand glyphs from Simple Icons (CC0). LinkedIn is not in the set, so its path is drawn here.
const LINKEDIN =
  'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z';

export const SOCIAL_PATHS = {
  youtube: siYoutube.path,
  instagram: siInstagram.path,
  tiktok: siTiktok.path,
  linkedin: LINKEDIN,
  facebook: siFacebook.path,
  patreon: siPatreon.path,
} as const;

export default function SocialIcon({ name }: { name: keyof typeof SOCIAL_PATHS }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={SOCIAL_PATHS[name]} />
    </svg>
  );
}
