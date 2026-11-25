import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CloseCta, FilmCard, SectionHead } from '@/components/Blocks';
import Icon from '@/components/Icon';
import Prose, { Facts } from '@/components/Prose';
import Render from '@/components/Render';
import JsonLd from '@/components/JsonLd';
import VideoPlayer from '@/components/VideoPlayer';
import { videoObject } from '@/lib/jsonld';
import { FILMS } from '@/lib/catalog';
import { animations, findBySlug } from '@/lib/content';
import { FILM_DETAIL } from '@/lib/details';
import { detailMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => animations.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = findBySlug(animations, slug);
  if (!e) return {};
  return detailMetadata({ path: `/animations/${slug}`, title: e.title, description: e.description, ownImage: true });
}

const base = '/images/films/wireless-earbuds-launch-film';

export default async function FilmPage({ params }: Props) {
  const { slug } = await params;
  if (slug !== FILM_DETAIL.slug) notFound();
  const f = FILM_DETAIL;
  const more = FILMS.filter((x) => x.href !== `/animations/${slug}`).slice(0, 3);

  return (
    <main id="main">
      <JsonLd data={videoObject({ name: f.title, description: f.lead, thumbnail: `${base}.jpg` })} />
      <section className="page-hero">
        <div className="wrap">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li><Link href="/animations">3D animations</Link><span aria-hidden="true">/</span></li>
              <li aria-current="page">{f.title}</li>
            </ol>
          </nav>
          <h1 className="h1">{f.title}</h1>
          <p className="lead">{f.lead}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 64 }}>
        <div className="wrap stack" style={{ gap: 40 }}>
          <VideoPlayer
            video={f.video}
            title={f.title}
            duration={f.facts[1].v.split(' ')[0]}
            poster={<Render src={`${base}.jpg`} sizes="100vw" priority ratio="r169" tone="teal" obj="round" alt="Poster frame: earbuds case opening under a teal key light" />}
          />
          <Facts items={f.facts} />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap narrow">
          <Prose blocks={f.sections} />
        </div>
      </section>

      <section className="sec mist" aria-labelledby="cuts-h">
        <div className="wrap">
          <SectionHead id="cuts-h" title="Social cut-downs" />
          <div className="g3">
            {f.cuts.map((c) => (
              <div key={c.title} className="stack" style={{ gap: 12 }}>
                <Render src={`${base}-${c.title.toLowerCase().replace(/\s+/g, '-')}.jpg`} ratio={c.ratio === '1:1' ? 'r11' : 'r45'} tone="teal" obj="round" alt={`${c.title}, ${c.ratio} vertical edit`}>
                  <span className="dur">{c.duration}</span>
                </Render>
                <p className="h5">{c.title}</p>
                <p className="meta">{c.ratio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-tight" aria-labelledby="more-h">
        <div className="wrap">
          <SectionHead id="more-h" title="More films">
            <Link className="btn btn-ghost" href="/animations">All films</Link>
          </SectionHead>
          <div className="g3">{more.map((m) => <FilmCard key={m.title} {...m} />)}</div>
        </div>
      </section>

      <CloseCta title="Need a launch film?" secondary={{ href: '/services/product-animation', label: 'How animation projects work' }} />
    </main>
  );
}
