import Link from 'next/link';
import { notFound } from 'next/navigation';
import Accordion from '@/components/Accordion';
import { SectionHead } from '@/components/Blocks';
import Render from '@/components/Render';
import JsonLd from '@/components/JsonLd';
import { course as courseLd } from '@/lib/jsonld';
import { COURSES } from '@/lib/catalog';
import { courses, findBySlug } from '@/lib/content';
import { COURSE_DETAIL } from '@/lib/details';
import { checkoutLink } from '@/lib/commerce/products';
import { detailMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => courses.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = findBySlug(courses, slug);
  if (!e) return {};
  return detailMetadata({ path: `/courses/${slug}`, title: e.title, description: e.description, ownImage: true });
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const c = COURSES.find((x) => x.slug === slug);
  if (!c || slug !== COURSE_DETAIL.slug) notFound();
  const d = COURSE_DETAIL;
  const lessonCount = d.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <main id="main">
      <JsonLd data={courseLd({ name: c.title, description: c.text, path: `/courses/${slug}`, price: c.price })} />
      <section className="page-hero">
        <div className="wrap">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li><Link href="/courses">Courses</Link><span aria-hidden="true">/</span></li>
              <li aria-current="page">{c.title}</li>
            </ol>
          </nav>
          <span className="badge b-outline">{c.level}</span>
          <h1 className="h1">{c.title}</h1>
          <p className="lead">{c.text}</p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <div className="stack" style={{ gap: 80 }}>
            <Render src={c.img} sizes="(max-width: 1024px) 100vw, 66vw" priority ratio="r169" tone={c.tone} obj={c.obj} alt={`Final render from the ${c.title}`} />

            <section aria-labelledby="out-h" className="stack" style={{ gap: 24 }}>
              <h2 className="h2" id="out-h">What you will be able to do</h2>
              <ul className="dots">{d.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
            </section>

            <section aria-labelledby="cur-h">
              <SectionHead id="cur-h" title="Curriculum" lead={`${d.modules.length} modules, ${lessonCount} lessons. Every lesson includes its scene file.`} />
              <ol className="modules">
                {d.modules.map((m, i) => (
                  <li key={m.title}>
                    <div className="mod-head">
                      <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="h4">{m.title}</h3>
                      <span className="meta">{m.lessons.length} lessons</span>
                    </div>
                    <ul className="mod-lessons">{m.lessons.map((l) => <li key={l} className="md">{l}</li>)}</ul>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="req-h" className="stack" style={{ gap: 24 }}>
              <h2 className="h3" id="req-h">Before you start</h2>
              <ul className="dots">{d.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
            </section>

            <section aria-labelledby="cfaq-h">
              <h2 className="h3" id="cfaq-h" style={{ marginBottom: 16 }}>Course questions</h2>
              <Accordion items={d.faq} />
            </section>
          </div>

          <aside className="aside">
            <div className="card plan" style={{ gap: 20 }}>
              <p className="plan-price">{c.price}</p>
              <dl className="kv">
                <div><dt>Lessons</dt><dd>{lessonCount}</dd></div>
                <div><dt>Length</dt><dd>{d.duration}</dd></div>
                <div><dt>Level</dt><dd>{c.level}</dd></div>
                <div><dt>Updated</dt><dd>{d.updated}</dd></div>
              </dl>
              {checkoutLink(`course:${slug}`) ? (
                <a className="btn btn-primary btn-block" href={checkoutLink(`course:${slug}`)}>Enrol now</a>
              ) : (
                <button className="btn btn-block" type="button" disabled>Enrolment opens soon</button>
              )}
              <Link className="btn btn-secondary btn-block" href="/membership">Included in Pro</Link>
              <Link className="btn btn-ghost" href={`/learn/${slug}`} prefetch={false}>Already enrolled? Open the course</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
