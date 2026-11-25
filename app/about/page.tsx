import Link from 'next/link';
import { siBlender, siN8n } from 'simple-icons';
import { CloseCta, PageHero, SectionHead } from '@/components/Blocks';
import HeroVisual from '@/components/HeroVisual';
import Icon, { type IconName } from '@/components/Icon';
import Render from '@/components/Render';
import SocialIcon, { SOCIAL_PATHS } from '@/components/SocialIcon';
import { pageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = pageMetadata('/about');

// Blender and n8n use their marks (Simple Icons, CC0); Adobe marks are not in the set, so those show initials.
const tools: { name: string; use: string; mark: { path: string } | { text: string } }[] = [
  { name: 'Blender', use: 'Modelling, lighting, rendering and animation', mark: { path: siBlender.path } },
  { name: 'Substance Painter', use: 'Textures, labels and surface wear', mark: { text: 'Pt' } },
  { name: 'Photoshop', use: 'Retouching and final images', mark: { text: 'Ps' } },
  { name: 'After Effects', use: 'Compositing, titles and edits', mark: { text: 'Ae' } },
  { name: 'n8n', use: 'Automations for us and for clients', mark: { path: siN8n.path } },
];

const principles: { icon: IconName; title: string; text: string }[] = [
  { icon: 'image', title: 'Show the work', text: 'Renders and films do the talking. You approve clay previews before anything is lit.' },
  { icon: 'check', title: 'Fixed quotes', text: 'You know the price and the delivery date before work starts.' },
  { icon: 'pen', title: 'Plain language', text: 'We say what is included, what is not, and who it is for.' },
  { icon: 'mail', title: 'Remote by design', text: 'Briefs, reviews and delivery all happen online, on your schedule.' },
];

const channels: { key: keyof typeof SOCIAL_PATHS; label: string; text: string }[] = [
  { key: 'youtube', label: 'YouTube', text: 'Tutorials and the free series' },
  { key: 'instagram', label: 'Instagram', text: 'New renders first' },
  { key: 'tiktok', label: 'TikTok', text: 'Process in 30 seconds' },
  { key: 'linkedin', label: 'LinkedIn', text: 'Studio news' },
  { key: 'facebook', label: 'Facebook', text: 'Community updates' },
  { key: 'patreon', label: 'Patreon', text: 'Scene files for supporters' },
];

export default function About() {
  return (
    <main id="main">
      <PageHero
        title="About Behind CG"
        lead="A remote 3D studio making product renders and animations for brands, and Blender addons, scene files and courses for artists."
        visual={
          <HeroVisual
            main={{ src: '/images/about/studio.jpg', tone: 'warm', obj: 'bottle', alt: 'Work-in-progress render of a perfume bottle in the studio scene' }}
            inset={{ src: '/images/about/clay.jpg', tone: 'clay', obj: 'jar', alt: 'Clay preview of a cosmetics jar' }}
            chip={{ icon: 'cube', text: 'Made in Blender' }}
          />
        }
      >
        <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
        <Link className="btn btn-secondary" href="/portfolio">See the work</Link>
      </PageHero>

      <section className="sec mist" aria-labelledby="story-h">
        <div className="wrap feature">
          <Render src="/images/about/founder.jpg" sizes="(max-width: 1024px) 100vw, 50vw" ratio="r45" tone="cool" obj="round" alt="[Founder portrait or studio desk]" />
          <div className="stack" style={{ gap: 24 }}>
            <h2 className="h2" id="story-h">Artists who also build the tools</h2>
            <div className="prose">
              <p>[Founder name] started Behind CG to make product visuals that look like the real thing, then kept building Blender tools to make that work faster. [Two or three sentences on the founding story.]</p>
              <p>Today the studio works with brands on renders and films, and shares the same tools and methods with artists through addons, scene files, courses and the free 3D Product Visualization Series on YouTube.</p>
            </div>
            <div className="row">
              <Link className="btn btn-secondary" href="/addons">See our addons</Link>
              <Link className="btn btn-ghost" href="/courses">Browse courses<Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="tools-h">
        <div className="wrap">
          <SectionHead id="tools-h" title="What we work with" lead="The same tools on every client job, every addon and every course." />
          <ul className="tools">
            {tools.map((t) => (
              <li key={t.name} className="tool">
                <span className="tool-mark" aria-hidden="true">
                  {'path' in t.mark ? (
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d={t.mark.path} /></svg>
                  ) : (
                    <span>{t.mark.text}</span>
                  )}
                </span>
                <h3 className="h4">{t.name}</h3>
                <p className="md">{t.use}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec mist" aria-labelledby="how-h">
        <div className="wrap feature how">
          <div className="how-media">
            <Render src="/images/about/process.jpg" sizes="(max-width: 1024px) 100vw, 50vw" ratio="r45" tone="clay" obj="bottle" alt="Clay preview of a bottle, the stage clients approve before lighting" />
          </div>
          <div className="stack" style={{ gap: 32 }}>
            <div className="stack" style={{ gap: 16 }}>
              <h2 className="h2" id="how-h">How we work</h2>
              <p className="lead">Four habits behind every project, from a single packshot to a launch film.</p>
            </div>
            <ul className="principles">
              {principles.map((p) => (
                <li key={p.title}>
                  <span className="icon-tile"><Icon name={p.icon} /></span>
                  <div className="stack" style={{ gap: 6 }}>
                    <h3 className="h4">{p.title}</h3>
                    <p className="md">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="follow-h">
        <div className="wrap">
          <SectionHead id="follow-h" title="Follow the work" lead="New renders, breakdowns and tutorials, wherever you watch." />
          <ul className="socials-grid">
            {channels.map((c) => (
              <li key={c.key}>
                <a href={SITE.social[c.key]} target="_blank" rel="noopener" className="social-tile">
                  <span className="social-tile-ic"><SocialIcon name={c.key} /></span>
                  <span className="stack" style={{ gap: 2 }}>
                    <span className="h5">{c.label}</span>
                    <span className="sm">{c.text}</span>
                  </span>
                  <Icon name="arrowUpRight" className="ic social-tile-go" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CloseCta
        title="Work with us"
        lead="Brands: get a fixed quote within two working days. Artists: start with the free scene files."
        secondary={{ href: '/free-downloads', label: 'Free scene files' }}
      />
    </main>
  );
}
