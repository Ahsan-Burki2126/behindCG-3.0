import Link from 'next/link';
import { PageHero, SectionHead } from '@/components/Blocks';
import Icon from '@/components/Icon';
import Render from '@/components/Render';
import { COURSES, EPISODES } from '@/lib/catalog';
import HeroVisual from '@/components/HeroVisual';
import { pageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = pageMetadata('/courses');

export default function Courses() {
  return (
    <main id="main">
      <PageHero
        title="Blender product visualization courses"
        lead="Project-based courses on modelling, materials, lighting and animation for product renders. Every lesson comes with its scene file."
        visual={
          <HeroVisual main={{ src: '/images/courses/product-visualization-masterclass.jpg', tone: 'clay', obj: 'jar', alt: 'Final render from the Masterclass' }} inset={{ src: '/images/home/learn.jpg', tone: 'cool', obj: 'bottle', alt: 'Lesson render from the free series' }} chip={{ icon: 'book', text: 'Project files with every lesson' }} />
        }
      >
        <Link className="btn btn-primary" href="/courses/product-visualization-masterclass">See the Masterclass</Link>
        <a className="btn btn-secondary" href={SITE.social.youtube} target="_blank" rel="noopener">Watch the free series</a>
      </PageHero>

      <section className="sec" style={{ paddingTop: 0 }} aria-label="Courses">
        <div className="wrap g3">
          {COURSES.map((c) => {
            const body = (
              <>
                <Render src={c.img} ratio="r169" tone={c.tone} obj={c.obj} alt={`Final render from the ${c.title} course`} />
                <div className="card-body">
                  <div className="row" style={{ gap: 8 }}>
                    <span className="badge b-outline">{c.level}</span>
                    {c.status && <span className="badge b-brand">{c.status}</span>}
                  </div>
                  <h2 className="h4">{c.title}</h2>
                  <p className="md">{c.text}</p>
                  <div className="card-foot">
                    <span className="price">{c.price}</span>
                    <span className="meta">{c.lessons}</span>
                  </div>
                </div>
              </>
            );
            return c.slug ? (
              <Link key={c.title} href={`/courses/${c.slug}`} className="card">{body}</Link>
            ) : (
              <article key={c.title} className="card">{body}</article>
            );
          })}
        </div>
      </section>

      <section className="sec light" aria-labelledby="free-h">
        <div className="wrap feature" style={{ alignItems: 'start' }}>
          <div className="stack" style={{ gap: 24, alignItems: 'flex-start' }}>
            <h2 className="h2" id="free-h">Start free: the 3D Product Visualization Series</h2>
            <p className="body">Four episodes on YouTube that take one product from reference photos to a finished render.</p>
            <a className="btn btn-secondary" href={SITE.social.youtube} target="_blank" rel="noopener">Watch on YouTube</a>
          </div>
          <ol className="eps">
            {EPISODES.map((e) => (
              <li key={e.n}>
                <span className="step-n">{String(e.n).padStart(2, '0')}</span>
                <span className="h5">{e.title}</span>
                <span className="meta">{e.duration}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec" aria-labelledby="mem-h">
        <div className="wrap">
          <SectionHead id="mem-h" title="Want every course?" lead="The Pro membership includes all courses and the full scene file library.">
            <Link className="btn btn-ghost" href="/membership">Compare memberships<Icon name="arrow" /></Link>
          </SectionHead>
        </div>
      </section>
    </main>
  );
}
