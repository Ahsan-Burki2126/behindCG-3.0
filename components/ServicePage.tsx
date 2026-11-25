import Link from 'next/link';
import Accordion from './Accordion';
import { CloseCta, SectionHead } from './Blocks';
import Icon from './Icon';
import HeroVisual from './HeroVisual';
import JsonLd from './JsonLd';
import { breadcrumbs, service as serviceLd } from '@/lib/jsonld';
import Render from './Render';
import { SERVICES, type Service } from '@/lib/services';

export default function ServicePage({ s }: { s: Service }) {
  const others = SERVICES.filter((o) => o.path !== s.path);
  return (
    <main id="main">
      <JsonLd data={[serviceLd({ name: s.name, description: s.lead, path: s.path }), breadcrumbs([{ name: 'Services', path: '/services' }, { name: s.name, path: s.path }])]} />
      <section className="page-hero">
        <div className="wrap feature svc-hero">
          <div className="stack" style={{ gap: 24, alignItems: 'flex-start' }}>
            <nav aria-label="Breadcrumb">
              <ol className="crumbs">
                <li className="crumbs"><Link href="/services">Services</Link><span aria-hidden="true">/</span></li>
                <li aria-current="page">{s.name}</li>
              </ol>
            </nav>
            <h1 className="h1">{s.h1}</h1>
            <p className="lead">{s.lead}</p>
            <div className="row">
              <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
              {s.secondary && <Link className="btn btn-secondary" href={s.secondary.href}>{s.secondary.label}</Link>}
            </div>
          </div>
          <HeroVisual main={{ src: s.img, tone: s.render.tone, obj: s.render.obj, alt: s.render.alt }} inset={{ src: s.img.replace('.jpg', '-detail.jpg'), tone: s.render.tone === 'clay' ? 'cool' : 'clay', obj: s.render.obj, alt: `${s.name} detail` }} chip={{ icon: 'check', text: 'Fixed quote in 2 working days' }} />
        </div>
      </section>

      <section className="sec light" aria-labelledby="del-h">
        <div className="wrap">
          <SectionHead id="del-h" title="What you get" lead={s.start}>
            <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
          </SectionHead>
          {/* Image and tiles share one row height; an odd last tile spans both columns. */}
          <div className="deliver">
            <Render src={s.img.replace('.jpg', '-set.jpg')} sizes="(max-width: 1024px) 100vw, 50vw" ratio="" tone={s.render.tone} obj={s.render.obj} alt={`Example ${s.name.toLowerCase()} deliverables`} className="deliver-img" />
            <ul className="checks">
              {s.deliverables.map((d) => (
                <li key={d}><span className="check-ic"><Icon name="check" /></span>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="fit-h">
        <div className="wrap">
          <SectionHead id="fit-h" title="Where it helps most" />
          <div className="g3">
            {s.goodFor.map((g, i) => (
              <div key={g.title} className="fit-card">
                <span className="icon-tile"><Icon name={(['cube', 'layers', 'image'] as const)[i % 3]} /></span>
                <h3 className="h4">{g.title}</h3>
                <p className="md">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec mist" aria-labelledby="steps-h">
        <div className="wrap">
          <SectionHead id="steps-h" title="How it runs" lead="You approve each stage before the next one starts." />
          <ol className="g4 steps">
            {s.steps.map((p, i) => (
              <li key={p.title} className="step">
                <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h4">{p.title}</h3>
                <p className="md">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec" aria-labelledby="faq-h">
        <div className="wrap faq-split">
          <div className="stack" style={{ gap: 16, alignItems: 'flex-start' }}>
            <h2 className="h2" id="faq-h">Questions about this service</h2>
            <Link className="btn btn-ghost" href="/faq">All FAQs<Icon name="arrow" /></Link>
          </div>
          <Accordion items={s.faq} />
        </div>
      </section>

      <section className="sec-tight mist" aria-labelledby="other-h">
        <div className="wrap">
          <h2 className="h3" id="other-h" style={{ marginBottom: 24 }}>Other services</h2>
          <div className="g3">
            {others.map((o) => (
              <Link key={o.path} href={o.path} className="card hoverable other-svc">
                <span className="h4">{o.name}</span>
                <span className="md">{o.short}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CloseCta />
    </main>
  );
}
