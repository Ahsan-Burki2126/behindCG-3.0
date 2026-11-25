import Link from 'next/link';
import { notFound } from 'next/navigation';
import BeforeAfter from '@/components/BeforeAfter';
import { CloseCta, SectionHead, WorkCard } from '@/components/Blocks';
import Icon from '@/components/Icon';
import Prose, { Facts } from '@/components/Prose';
import Render from '@/components/Render';
import Model3D from '@/components/Model3D';
import { WORK } from '@/lib/catalog';
import { caseStudies, findBySlug } from '@/lib/content';
import { CASE_STUDY } from '@/lib/details';
import { detailMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => caseStudies.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = findBySlug(caseStudies, slug);
  if (!e) return {};
  return detailMetadata({ path: `/portfolio/${slug}`, title: e.title, description: e.description, ownImage: true });
}

const base = '/images/case-studies/plant-based-sleeping-mask';

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  if (slug !== CASE_STUDY.slug) notFound();
  const cs = CASE_STUDY;
  const more = WORK.filter((w) => w.href !== `/portfolio/${slug}`).slice(0, 3);

  return (
    <main id="main">
      <section className="page-hero">
        <div className="wrap">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li><Link href="/portfolio">Portfolio</Link><span aria-hidden="true">/</span></li>
              <li aria-current="page">Case study</li>
            </ol>
          </nav>
          <h1 className="h1">{cs.title}</h1>
          <p className="lead">{cs.lead}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 64 }}>
        <div className="wrap stack" style={{ gap: 40 }}>
          <Model3D model={cs.model} src={`${base}/hero.jpg`} sizes="100vw" ratio="r219" tone="cool" obj="jar" alt="Frosted glass sleeping mask jar on a stone plinth, hero shot" />
          <Facts items={cs.facts} />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap narrow">
          <Prose blocks={cs.sections} />
        </div>
      </section>

      <section className="sec mist" aria-labelledby="ba-h">
        <div className="wrap">
          <SectionHead id="ba-h" title="Clay to final" lead="Drag the handle to compare the approved clay preview with the delivered render." />
          <BeforeAfter
            label="Compare clay preview and final render"
            before={<Render src={`${base}/clay.jpg`} ratio="" tone="clay" obj="jar" alt="Clay preview of the jar" sizes="100vw" />}
            after={<Render src={`${base}/final.jpg`} ratio="" tone="cool" obj="jar" alt="Final render of the jar" sizes="100vw" />}
          />
        </div>
      </section>

      <section className="sec" aria-labelledby="gal-h">
        <div className="wrap">
          <SectionHead id="gal-h" title="The delivered set" />
          <div className="g3">
            {['packshot-front', 'packshot-open', 'detail-lid', 'lifestyle-bathroom', 'lifestyle-night', 'packshot-box'].map((n, i) => (
              <Render key={n} src={`${base}/${n}.jpg`} ratio={i > 2 ? 'r45' : 'r11'} tone={i % 2 ? 'warm' : 'cool'} obj={n.includes('box') ? 'box' : 'jar'} alt={`Sleeping mask render: ${n.replace(/-/g, ' ')}`} />
            ))}
          </div>
          <p className="body" style={{ marginTop: 40 }}>{cs.result}</p>
        </div>
      </section>

      <section className="sec-tight" aria-labelledby="more-h">
        <div className="wrap">
          <SectionHead id="more-h" title="More work">
            <Link className="btn btn-ghost" href="/portfolio">Full portfolio<Icon name="arrow" /></Link>
          </SectionHead>
          <div className="g3">{more.map((w) => <WorkCard key={w.title} item={w} />)}</div>
        </div>
      </section>

      <CloseCta title="Launching before your samples arrive?" />
    </main>
  );
}
