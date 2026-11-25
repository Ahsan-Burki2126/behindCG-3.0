import Link from "next/link";
import Logo from "./Logo";
import CookieSettingsButton from "./CookieSettingsButton";
import SocialIcon from "./SocialIcon";
import MobileCta from "./MobileCta";
import { FOOTER } from "@/lib/nav";
import { SITE } from "@/lib/site";

const socials: { key: keyof typeof SITE.social; label: string }[] = [
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "facebook", label: "Facebook" },
  { key: "patreon", label: "Patreon" },
];

export default function Footer() {
  return (
    <>
      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div
              className="stack"
              style={{ gap: 24, alignItems: "flex-start" }}
            >
              <Logo full />
              <p className="md" style={{ maxWidth: 320 }}>
                {SITE.tagline}. 3D renders and animations for brands, and
                Blender tools and courses for artists.
              </p>
              <p className="md">
                <a href={`mailto:${SITE.email.hello}`}>{SITE.email.hello}</a>
              </p>
              <ul
                className="social center"
                aria-label="Behind CG on social media"
              >
                {socials.map((s) => (
                  <li key={s.key}>
                    <a
                      href={SITE.social[s.key]}
                      aria-label={`Behind CG on ${s.label}`}
                      title={s.label}
                      rel="noopener"
                      target="_blank"
                    >
                      <SocialIcon name={s.key} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {FOOTER.map((col) => (
              <nav key={col.heading} aria-labelledby={`foot-${col.heading}`}>
                <h2 className="foot-h" id={`foot-${col.heading}`}>
                  {col.heading}
                </h2>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} prefetch={false}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="foot-bottom">
            <p>
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
            <nav aria-label="Legal">
              <Link href="/privacy" prefetch={false}>
                Privacy
              </Link>
              <Link href="/terms" prefetch={false}>
                Terms and refunds
              </Link>
              <Link href="/licenses" prefetch={false}>
                Licences
              </Link>
              <CookieSettingsButton />
            </nav>
          </div>
        </div>
      </footer>
      <MobileCta />
    </>
  );
}
