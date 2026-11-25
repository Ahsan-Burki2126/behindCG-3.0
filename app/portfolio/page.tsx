import Link from 'next/link';
import { CloseCta, PageHero, WorkCard } from '@/components/Blocks';
import Gallery from '@/components/Gallery';
import Render from '@/components/Render';
import { WORK, WORK_CATEGORIES } from '@/lib/catalog';
import HeroVisual from '@/components/HeroVisual';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/portfolio');

export default function Portfolio() {
  return (
    <main id="main">
      <PageHero
        title="Portfolio"
        lead="Photoreal 3D product renders for beauty, tech, packaging, automotive and furniture brands: packshots, lifestyle scenes and detail shots."
        visual={
          <HeroVisual main={{ src: '/images/work/plant-based-sleeping-mask.jpg', tone: 'cool', obj: 'jar', alt: 'Frosted glass skincare jar on a stone plinth' }} inset={{ src: '/images/work/sparkling-water-can.jpg', tone: 'warm', obj: 'can', alt: 'Drinks can with condensation' }} chip={{ icon: 'image', text: 'Beauty · Tech · Packaging' }} />
        }
      >
        <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
        <Link className="btn btn-secondary" href="/animations">Watch the films</Link>
      </PageHero>
      <section className="sec" style={{ paddingTop: 0 }} aria-label="Renders">
        <div className="wrap">
          <Gallery
            label="Filter by category"
            categories={WORK_CATEGORIES}
            items={WORK.map((w, i) => ({
              key: w.title,
              category: w.category,
              title: w.title,
              card: <WorkCard item={w} ratio={i % 3 === 0 ? 'r45' : 'r43'} />,
              full: w.href ? undefined : <Render src={w.img} sizes="94vw" ratio="r32" tone={w.tone} obj={w.obj} alt={w.alt} />,
            }))}
          />
        </div>
      </section>
      <CloseCta title="Want your product to look like this?" />
    </main>
  );
}
