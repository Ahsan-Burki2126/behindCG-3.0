import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SectionHead } from '@/components/Blocks';
import Render from '@/components/Render';
import JsonLd from '@/components/JsonLd';
import { article as articleLd, breadcrumbs } from '@/lib/jsonld';
import { getAllPosts, getPost } from '@/lib/blog';
import { findBySlug, posts } from '@/lib/content';
import { detailMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = findBySlug(posts, slug);
  if (!e) return {};
  return detailMetadata({ path: `/blog/${slug}`, title: e.title, description: e.description, article: true, ownImage: true });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const more = getAllPosts().filter((x) => x.slug !== slug).slice(0, 3);
  const forArtists = p.category === 'Tutorial';

  return (
    <main id="main">
      <div className="read-progress" aria-hidden="true"><span /></div>
      <JsonLd data={[articleLd({ title: p.title, description: p.description, path: `/blog/${slug}`, date: p.date }), breadcrumbs([{ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${slug}` }])]} />
      <article>
        <header className="page-hero">
          <div className="wrap narrow">
            <nav aria-label="Breadcrumb">
              <ol className="crumbs">
                <li><Link href="/blog">Blog</Link><span aria-hidden="true">/</span></li>
                <li aria-current="page">{p.category}</li>
              </ol>
            </nav>
            <h1 className="h1">{p.title}</h1>
            <p className="lead">{p.description}</p>
            <p className="meta">{p.date} · {p.read}</p>
          </div>
        </header>

        <div className="wrap" style={{ marginBottom: 80 }}>
          <Render src={p.img} sizes="100vw" priority ratio="r219" tone={p.tone} obj={p.obj} alt={`Cover image for ${p.title}`} />
        </div>

        <div className="wrap split" style={{ paddingBottom: 120 }}>
          {/* Trusted Markdown from content/blog, rendered at build time (lib/blog.ts). */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />
          <aside className="aside">
            {p.headings.length > 1 && (
              <nav className="toc" aria-label="On this page">
                {p.headings.map((h) => <a key={h.id} href={`#${h.id}`}>{h.text}</a>)}
              </nav>
            )}
            <div className="card" style={{ padding: 24, gap: 12 }}>
              {forArtists ? (
                <>
                  <h2 className="h5">Practise on a real scene</h2>
                  <p className="sm">Download a free studio scene and try this setup yourself.</p>
                  <Link className="btn btn-secondary" href="/free-downloads">Get free scene files</Link>
                </>
              ) : (
                <>
                  <h2 className="h5">Planning a product launch?</h2>
                  <p className="sm">Get a plan and a fixed quote within two working days.</p>
                  <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
                </>
              )}
            </div>
          </aside>
        </div>
      </article>

      <section className="sec mist" aria-labelledby="more-h">
        <div className="wrap">
          <SectionHead id="more-h" title="Keep reading" />
          <div className="g3">
            {more.map((m) => (
              <Link key={m.slug} href={`/blog/${m.slug}`} className="card-link">
                <Render src={m.img} ratio="r32" tone={m.tone} obj={m.obj} alt={`Cover image for ${m.title}`} />
                <span className="cat">{m.category}</span>
                <h3 className="h4 hl">{m.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
