import Link from 'next/link';
import Icon from '@/components/Icon';
import Render from '@/components/Render';
import VideoPlayer from '@/components/VideoPlayer';
import { AddonCard, WorkCard } from '@/components/Blocks';
import { ADDONS, SHOWREEL, SHOWREEL_DURATION, WORK } from '@/lib/catalog';
import { NAV, isGroup } from '@/lib/nav';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/');

const services = (NAV.find((n) => isGroup(n) && n.label === 'Services') as { items: { href: string; label: string; blurb?: string }[] }).items;

const process = [
  { title: 'Brief', text: 'Send CAD files, photos or the product itself, plus where the visuals will run and when you launch.' },
  { title: 'Plan and quote', text: 'Within two working days you get a shot list, a schedule and a fixed price.' },
  { title: 'Clay previews', text: 'You approve camera angles and composition in grey before any lighting or materials.' },
  { title: 'Final delivery', text: 'Full-resolution renders or films, cropped and cut for every channel on the list.' },
];

export default function Home() {
  return (
    <main id="main">
      {/* Hero: the work leads, copy sits on its dark side */}
      <section className="hero">
        <Render
          src="/images/home/hero.jpg"
          sizes="100vw"
          priority
          className="hero-media"
          ratio=""
          obj="bottle"
          alt="Hero render: a glass serum bottle under a single soft key light on a dark teal set"
        />
        <div className="hero-float" aria-hidden="true">
          <p className="hv-chip hero-chip-a"><span className="hv-chip-ic"><Icon name="cube" /></span>Rendered in Blender</p>
          <p className="hv-chip hero-chip-b"><span className="hv-chip-ic"><Icon name="check" /></span>Fixed quote in 2 working days</p>
          <p className="hv-chip hero-chip-c"><span className="hv-chip-ic"><Icon name="film" /></span>Stills · Films · Variants</p>
        </div>
        <div className="wrap hero-copy">
          <h1 className="h1">3D product renders and <em>animations</em> for brands</h1>
          <p className="lead">
            Photoreal stills and launch films made in Blender for your store, marketplace listings and ads. Artists get
            the same studio&apos;s addons, scene files and courses.
          </p>
          <div className="row">
            <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
            <Link className="btn btn-secondary" href="/addons">Browse Blender addons</Link>
          </div>
        </div>
      </section>

      {/* Capabilities marquee */}
      <section className="marquee" aria-label="What we make">
        <button type="button" className="marquee-toggle" aria-pressed="false" aria-label="Pause the scrolling list" hidden>
          <span aria-hidden="true" className="marquee-toggle-ic" />
        </button>
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <ul key={n} aria-hidden={n === 1 ? true : undefined}>
              {['Packshots', 'Lifestyle scenes', 'Colour variants', 'Launch films', 'Social reels', 'Turntables', 'Exploded views', 'Blender addons', 'Scene files', 'Courses'].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* Two doors, equal weight */}
      <section className="sec mist" aria-labelledby="doors-h">
        <div className="wrap">
          <div className="sh">
            <div className="sh-text">
              <h2 className="h2" id="doors-h">One studio, two ways to work with it</h2>
              <p className="lead">Hire us to make your product visuals, or use the tools and lessons we make them with.</p>
            </div>
          </div>
          <div className="g2">
            <article className="card door">
              <Render src="/images/home/for-brands.jpg" sizes="(max-width: 720px) 100vw, 50vw" ratio="r169" tone="warm" obj="can" alt="Drinks can packshot on a warm orange set" />
              <div className="card-body">
                <h3 className="h3">For brands</h3>
                <p className="md">Packshots, lifestyle scenes, colour variants and launch films, quoted as a fixed price before work starts.</p>
                <ul className="door-links">
                  <li><Link href="/services/product-visualization">Product visualization<Icon name="arrow" /></Link></li>
                  <li><Link href="/services/product-animation">Product animation<Icon name="arrow" /></Link></li>
                  <li><Link href="/portfolio">See the portfolio<Icon name="arrow" /></Link></li>
                </ul>
                <div className="card-foot">
                  <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
                </div>
              </div>
            </article>
            <article className="card door">
              <Render src="/images/home/for-artists.jpg" sizes="(max-width: 720px) 100vw, 50vw" ratio="r169" tone="wire" obj="jar" alt="Wireframe view of a jar model inside Blender's viewport" />
              <div className="card-body">
                <h3 className="h3">For Blender artists</h3>
                <p className="md">Addons that take the repetitive work out of product renders, studio scene files and project-based courses.</p>
                <ul className="door-links">
                  <li><Link href="/addons">Blender addons<Icon name="arrow" /></Link></li>
                  <li><Link href="/courses">Courses<Icon name="arrow" /></Link></li>
                  <li><Link href="/free-downloads">Free scene files<Icon name="arrow" /></Link></li>
                </ul>
                <div className="card-foot">
                  <Link className="btn btn-secondary" href="/membership">Compare memberships</Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Selected work: pinned horizontal showcase on desktop, swipeable row on touch */}
      <section className="hs" aria-labelledby="work-h">
        <div className="hs-sticky">
        <div className="wrap hs-head">
          <div className="sh-text">
            <h2 className="h2" id="work-h">Selected work</h2>
            <p className="lead">Recent stills and films for beauty, tech and packaging brands.</p>
          </div>
          <Link className="btn btn-ghost" href="/portfolio">View the portfolio<Icon name="arrow" /></Link>
        </div>
        <div className="hs-viewport">
          <ul className="hs-track">
            {WORK.slice(0, 8).map((w, i) => (
              <li key={w.title} className="hs-card">
                <span className="hs-num">{String(i + 1).padStart(2, '0')} / {String(Math.min(WORK.length, 8)).padStart(2, '0')}</span>
                <WorkCard item={w} ratio="r45" />
              </li>
            ))}
          </ul>
        </div>
        <div className="hs-progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      {/* Services: calm list after two visual sections */}
      <section className="sec light" aria-labelledby="svc-h">
        <div className="wrap svc">
          <div className="sh-text svc-intro">
            <h2 className="h2" id="svc-h">What we make</h2>
            <p className="lead">Four services, each quoted as a fixed price with a delivery date.</p>
            <Link className="btn btn-secondary" href="/services">Compare services</Link>
          </div>
          <ul className="svc-list">
            {services.map((s) => (
              <li key={s.href}>
                <Link href={s.href}>
                  <span className="stack" style={{ gap: 8 }}>
                    <span className="h3">{s.label}</span>
                    <span className="md">{s.blurb}</span>
                  </span>
                  <Icon name="arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Showreel */}
      <section className="sec" aria-labelledby="reel-h">
        <div className="wrap">
          <div className="sh">
            <div className="sh-text">
              <h2 className="h2" id="reel-h">Product animation, start to finish</h2>
              <p className="lead">Launch films, social reels and turntables, cut for every platform you post on.</p>
            </div>
          </div>
          <VideoPlayer
            video={SHOWREEL}
            title="Behind CG showreel"
            duration={SHOWREEL_DURATION}
            poster={<Render src="/images/home/showreel-poster.jpg" sizes="100vw" ratio="r219" tone="teal" obj="round" alt="Still from the studio showreel: earbuds case opening in slow motion" />}
          />
          <div className="row" style={{ marginTop: 24 }}>
            <Link className="btn btn-ghost" href="/animations">See every film<Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      {/* Process: a real sequence, so numbers are allowed */}
      <section className="sec mist" aria-labelledby="proc-h">
        <div className="wrap">
          <div className="sh">
            <div className="sh-text">
              <h2 className="h2" id="proc-h">How a project runs</h2>
              <p className="lead">You see and approve every stage before we move to the next one.</p>
            </div>
          </div>
          <ol className="g4 steps">
            {process.map((p, i) => (
              <li key={p.title} className="step">
                <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h4">{p.title}</h3>
                <p className="md">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Addons */}
      <section className="sec" aria-labelledby="addons-h">
        <div className="wrap">
          <div className="sh">
            <div className="sh-text">
              <h2 className="h2" id="addons-h">Blender addons we use on client work</h2>
              <p className="lead">Commercial licence and updates included with every addon.</p>
            </div>
            <Link className="btn btn-ghost" href="/addons">All addons<Icon name="arrow" /></Link>
          </div>
          <div className="g3">
            {ADDONS.slice(0, 3).map((a) => <AddonCard key={a.slug} item={a} />)}
          </div>
        </div>
      </section>

      {/* Learn */}
      <section className="sec light" aria-labelledby="learn-h">
        <div className="wrap feature">
          <Render src="/images/home/learn.jpg" sizes="(max-width: 720px) 100vw, 50vw" ratio="r169" tone="clay" obj="jar" alt="Clay render of a cosmetics jar from episode one of the free series" />
          <div className="stack" style={{ gap: 24, alignItems: 'flex-start' }}>
            <h2 className="h2" id="learn-h">Learn product visualization in Blender</h2>
            <p className="body">
              Start with the free 4-episode 3D Product Visualization Series on YouTube, then go deeper with project-based
              courses that come with every scene file.
            </p>
            <div className="row">
              <Link className="btn btn-secondary" href="/courses">Browse courses</Link>
              <Link className="btn btn-ghost" href="/blog">Read the tutorials<Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="sec" aria-labelledby="close-h">
        <div className="wrap">
          <div className="close">
            <h2 className="h2" id="close-h">Launching a product soon?</h2>
            <p className="lead">Tell us what it is and when it ships. You get a plan and a fixed quote within two working days.</p>
            <div className="row">
              <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
              <Link className="btn btn-ghost" href="/faq">Read the FAQ<Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
