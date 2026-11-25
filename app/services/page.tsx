import Link from 'next/link';
import { CloseCta, PageHero } from '@/components/Blocks';
import Icon from '@/components/Icon';
import Render from '@/components/Render';
import HeroVisual from '@/components/HeroVisual';
import { pageMetadata } from '@/lib/seo';
import { SERVICES } from '@/lib/services';

export const metadata = pageMetadata('/services');

export default function Services() {
  return (
    <main id="main">
      <PageHero
        title="Services"
        lead="3D product visualization, product animation, custom Blender addons and AI automations. Every project gets a fixed quote and a delivery date before work starts."
        visual={
          <HeroVisual main={{ src: '/images/home/for-brands.jpg', tone: 'warm', obj: 'can', alt: 'Drinks can packshot on a warm set' }} inset={{ src: '/images/services/blender-addon-development.jpg', tone: 'wire', obj: 'box', alt: 'Wireframe of a product model' }} chip={{ icon: 'check', text: 'Fixed quote in 2 working days' }} />
        }
      >
        <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
      </PageHero>

      {SERVICES.map((s, i) => (
        <section key={s.path} className={`sec ${i % 2 ? 'mist' : ''}`} aria-labelledby={`s-${i}`}>
          <div className={`wrap feature${i % 2 ? ' flip' : ''}`}>
            <Render src={s.img} sizes="(max-width: 720px) 100vw, 50vw" ratio="r43" tone={s.render.tone} obj={s.render.obj} alt={s.render.alt} />
            <div className="stack" style={{ gap: 24, alignItems: 'flex-start' }}>
              <h2 className="h2" id={`s-${i}`}>{s.name}</h2>
              <p className="body">{s.lead}</p>
              <ul className="dots">
                {s.deliverables.slice(0, 3).map((d) => <li key={d}>{d}</li>)}
              </ul>
              <Link className="btn btn-secondary" href={s.path}>
                Explore {s.name}
              </Link>
            </div>
          </div>
        </section>
      ))}

      <CloseCta secondary={{ href: '/faq', label: 'Read the FAQ' }} />
    </main>
  );
}
