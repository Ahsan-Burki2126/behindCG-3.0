import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Icon from '@/components/Icon';
import Render from '@/components/Render';
import VideoPlayer from '@/components/VideoPlayer';
import { COURSES } from '@/lib/catalog';
import { canAccessCourse } from '@/lib/commerce/access';
import { authEnabled } from '@/lib/commerce/config';
import { lessonVideo } from '@/lib/commerce/lessons';
import { checkoutLink } from '@/lib/commerce/products';
import { entitlementsFor } from '@/lib/commerce/store';
import { COURSE_DETAIL } from '@/lib/details';
import { currentUser } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Course', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export default async function Learn({ params }: Props) {
  const { slug } = await params;
  const course = COURSES.find((c) => c.slug === slug);
  if (!course || slug !== COURSE_DETAIL.slug) notFound();

  if (!authEnabled) redirect(`/courses/${slug}`);
  const user = await currentUser();
  if (!user?.email) redirect(`/sign-in?next=/learn/${slug}`);

  const ents = await entitlementsFor(user.email);
  if (!canAccessCourse(ents, slug)) {
    const buy = checkoutLink(`course:${slug}`, user.email);
    return (
      <main id="main">
        <section className="sec">
          <div className="wrap narrow close">
            <h1 className="h2">{course.title}</h1>
            <p className="md">This course isn&apos;t on your account yet. Buy it once, or get it with Pro membership along with every other course.</p>
            <div className="row">
              {buy && <a className="btn btn-primary" href={buy}>Buy the course</a>}
              <Link className="btn btn-secondary" href="/membership">See Pro membership</Link>
            </div>
            <p className="sm">Bought it with another email? Sign out and sign in with that one.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main">
      <section className="page-hero">
        <div className="wrap">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li><Link href="/account">Your account</Link><span aria-hidden="true">/</span></li>
              <li aria-current="page">{course.title}</li>
            </ol>
          </nav>
          <h1 className="h1">{course.title}</h1>
          <p className="lead">{COURSE_DETAIL.modules.length} modules. Press play on any lesson; project files are in your account.</p>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap narrow">
          <ol className="modules">
            {COURSE_DETAIL.modules.map((m, mi) => (
              <li key={m.title}>
                <div className="mod-head">
                  <span className="step-n">{String(mi + 1).padStart(2, '0')}</span>
                  <h2 className="h4">{m.title}</h2>
                  <span className="meta">{m.lessons.length} lessons</span>
                </div>
                <div className="lessons">
                  {m.lessons.map((l, li) => (
                    <details key={l} className="lesson">
                      <summary>
                        <span className="lesson-n">{mi + 1}.{li + 1}</span>
                        <span>{l}</span>
                        <Icon name="chevron" />
                      </summary>
                      <VideoPlayer
                        video={lessonVideo(slug, mi + 1, li + 1)}
                        title={l}
                        poster={<Render src={course.img} ratio="r169" tone={course.tone} obj={course.obj} alt="" decorative />}
                      />
                    </details>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
