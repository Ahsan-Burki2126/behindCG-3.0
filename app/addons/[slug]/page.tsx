import Link from 'next/link';
import { notFound } from 'next/navigation';
import Accordion from '@/components/Accordion';
import { AddonCard, SectionHead } from '@/components/Blocks';
import Icon from '@/components/Icon';
import Render from '@/components/Render';
import JsonLd from '@/components/JsonLd';
import { breadcrumbs, softwareProduct } from '@/lib/jsonld';
import { ADDONS } from '@/lib/catalog';
import { addons, findBySlug } from '@/lib/content';
import { ADDON_DETAILS } from '@/lib/details';
import { checkoutLink } from '@/lib/commerce/products';
import { detailMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => ADDONS.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = findBySlug(addons, slug);
  if (!e) return {};
  return detailMetadata({ path: `/addons/${slug}`, title: e.title, description: e.description, ownImage: true });
}

export default async function AddonPage({ params }: Props) {
  const { slug } = await params;
  const a = ADDONS.find((x) => x.slug === slug);
  const d = ADDON_DETAILS[slug];
  if (!a || !d) notFound();
  const related = ADDONS.filter((x) => x.slug !== slug).slice(0, 3);
  // Lemon Squeezy checkout (lib/commerce/products.ts) first, then a marketplace link (e.g. Superhive).
  const buyUrl = checkoutLink(`addon:${slug}`) || d.buyUrl;

  return (
    <main id="main">
      <JsonLd data={[softwareProduct({ name: a.name, description: a.blurb, path: `/addons/${slug}`, price: a.price, image: a.img }), breadcrumbs([{ name: 'Blender addons', path: '/addons' }, { name: a.name, path: `/addons/${slug}` }])]} />
      <section className="page-hero">
        <div className="wrap feature svc-hero">
          <Render src={a.img} sizes="(max-width: 1024px) 100vw, 50vw" priority ratio="r43" tone={a.tone} obj={a.obj} alt={`${a.name} panel inside Blender`} />
          <div className="stack" style={{ gap: 24, alignItems: 'flex-start' }}>
            <nav aria-label="Breadcrumb">
              <ol className="crumbs">
                <li><Link href="/addons">Blender addons</Link><span aria-hidden="true">/</span></li>
                <li aria-current="page">{a.name}</li>
              </ol>
            </nav>
            {a.badge && <span className={`badge ${a.badge.kind}`}>{a.badge.label}</span>}
            <h1 className="h1">{a.name}</h1>
            <p className="lead">{a.blurb}</p>
            <p className="plan-price">{a.price}</p>
            <div className="row">
              {buyUrl ? (
                <a className="btn btn-primary" href={buyUrl} target="_blank" rel="noopener">Buy {a.name}</a>
              ) : (
                <button className="btn" type="button" disabled>Available soon</button>
              )}
              <Link className="btn btn-secondary" href="/licenses">Compare licences</Link>
            </div>
            <p className="meta">Version {d.version} · Updated {d.updated} · Blender {a.blender}</p>
          </div>
        </div>
      </section>

      <section className="sec light" aria-labelledby="feat-h">
        <div className="wrap">
          <SectionHead id="feat-h" title="What it does" />
          <div className="g4">
            {d.features.map((f) => (
              <div key={f.title} className="stack fit" style={{ gap: 12 }}>
                <h3 className="h4">{f.title}</h3>
                <p className="md">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="how-h">
        <div className="wrap feature" style={{ alignItems: 'start' }}>
          <div className="stack" style={{ gap: 24 }}>
            <h2 className="h2" id="how-h">How to use it</h2>
            <ol className="steps-list">
              {d.steps.map((s, i) => (
                <li key={s}><span className="step-n">{i + 1}</span><span className="body">{s}</span></li>
              ))}
            </ol>
          </div>
          <div className="card" style={{ padding: 32, gap: 16 }}>
            <h2 className="h4">Requirements</h2>
            <ul className="dots">{d.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
            <p className="sm">Includes a commercial licence, free updates and email support.</p>
          </div>
        </div>
      </section>

      <section className="sec mist" aria-labelledby="afaq-h">
        <div className="wrap narrow">
          <SectionHead id="afaq-h" title={`${a.name} questions`}>
            <Link className="btn btn-ghost" href="/faq#addons">All addon FAQs<Icon name="arrow" /></Link>
          </SectionHead>
          <Accordion items={d.faq} />
        </div>
      </section>

      <section className="sec" aria-labelledby="rel-h">
        <div className="wrap">
          <SectionHead id="rel-h" title="More addons" />
          <div className="g3">{related.map((r) => <AddonCard key={r.slug} item={r} />)}</div>
        </div>
      </section>
    </main>
  );
}
