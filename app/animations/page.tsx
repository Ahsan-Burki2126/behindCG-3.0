import Link from 'next/link';
import { CloseCta, FilmCard, PageHero } from '@/components/Blocks';
import Filter from '@/components/Filter';
import Icon from '@/components/Icon';
import Render from '@/components/Render';
import VideoPlayer from '@/components/VideoPlayer';
import { FILMS, FILM_CATEGORIES, SHOWREEL, SHOWREEL_DURATION } from '@/lib/catalog';
import HeroVisual from '@/components/HeroVisual';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/animations');

export default function Animations() {
  return (
    <main id="main">
      <PageHero
        title="3D product animations"
        lead="Launch films, social reels, turntables and explainers rendered in Blender and cut for every platform you post on."
        visual={
          <HeroVisual main={{ src: '/images/home/showreel-poster.jpg', tone: 'teal', obj: 'round', alt: 'Showreel still: earbuds case opening' }} inset={{ src: '/images/films/serum-bottle-reveal.jpg', tone: 'cool', obj: 'bottle', alt: 'Serum bottle reveal, social reel' }} chip={{ icon: 'film', text: 'Launch films · Reels · Turntables' }} />
        }
      >
        <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
        <Link className="btn btn-secondary" href="/services/product-animation">How animation projects work</Link>
      </PageHero>

      <section className="sec-tight" style={{ paddingTop: 0 }} aria-label="Showreel">
        <div className="wrap">
          <VideoPlayer
            video={SHOWREEL}
            title="Behind CG showreel"
            duration={SHOWREEL_DURATION}
            poster={<Render src="/images/home/showreel-poster.jpg" sizes="100vw" ratio="r169" tone="teal" obj="round" alt="Studio showreel poster: earbuds case under a teal key light" />}
          />
        </div>
      </section>

      <section className="sec" aria-labelledby="films-h">
        <div className="wrap">
          <h2 className="h2" id="films-h" style={{ marginBottom: 32 }}>Films</h2>
          <Filter
            label="Filter by type"
            categories={FILM_CATEGORIES}
            gridClass="g3"
            items={FILMS.map((f) => ({ key: f.title, category: f.category, node: <FilmCard {...f} /> }))}
          />
        </div>
      </section>

      <CloseCta title="Need a film for your launch?" secondary={{ href: '/portfolio', label: 'See still renders' }} />
    </main>
  );
}
