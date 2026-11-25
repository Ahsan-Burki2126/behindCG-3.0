import Link from 'next/link';
import { AddonCard, PageHero, SectionHead } from '@/components/Blocks';
import Icon from '@/components/Icon';
import { ADDONS } from '@/lib/catalog';
import HeroVisual from '@/components/HeroVisual';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/addons');

const included = [
  { icon: 'file' as const, title: 'Commercial licence', text: 'Use every addon on paid client work. Studio licences cover a whole team.' },
  { icon: 'download' as const, title: 'Updates', text: 'New Blender releases and fixes, downloaded from your account.' },
  { icon: 'mail' as const, title: 'Support by email', text: 'Install help and bug reports answered by the person who wrote the code.' },
];

export default function Addons() {
  return (
    <main id="main">
      <PageHero
        title="Blender addons for product artists"
        lead="Tools we built for our own client work, to take the repetitive steps out of product rendering. Commercial licence and updates included."
        visual={
          <HeroVisual main={{ src: '/images/addons/batch-render-pro.jpg', tone: 'wire', obj: 'box', alt: 'Batch Render Pro panel in Blender' }} inset={{ src: '/images/addons/clay-render-pro.jpg', tone: 'clay', obj: 'bottle', alt: 'Clay Render Pro preview' }} chip={{ icon: 'puzzle', text: 'Blender 4.2+ · Commercial licence' }} />
        }
      >
        <Link className="btn btn-primary" href="/addons/batch-render-pro">See Batch Render Pro</Link>
        <Link className="btn btn-secondary" href="/free-downloads">Get free scene files</Link>
      </PageHero>

      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="all-addons">
        <h2 className="sr-only" id="all-addons">All addons</h2>
        <div className="wrap g3 addon-grid">
          {ADDONS.map((a) => <AddonCard key={a.slug} item={a} />)}
        </div>
      </section>

      <section className="sec mist" aria-labelledby="inc-h">
        <div className="wrap">
          <SectionHead id="inc-h" title="Included with every addon">
            <Link className="btn btn-ghost" href="/licenses">Compare licences<Icon name="arrow" /></Link>
          </SectionHead>
          <div className="g3">
            {included.map((i) => (
              <div key={i.title} className="fit-card">
                <span className="icon-tile"><Icon name={i.icon} /></span>
                <h3 className="h4">{i.title}</h3>
                <p className="md">{i.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="custom-h">
        <div className="wrap">
          <div className="brand-band">
            <div className="stack" style={{ gap: 16 }}>
              <h2 className="h2" id="custom-h">Need a tool that does not exist yet?</h2>
              <p className="lead">We build custom Blender addons for studios and product teams.</p>
            </div>
            <div className="row">
              <Link className="btn btn-primary" href="/services/blender-addon-development">Explore addon development</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
