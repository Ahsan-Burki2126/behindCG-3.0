import Link from 'next/link';
import { PageHero } from '@/components/Blocks';
import Filter from '@/components/Filter';
import Render from '@/components/Render';
import { getAllPosts, POST_CATEGORIES, type Post } from '@/lib/blog';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/blog');

function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}`} className="card-link">
      <Render src={p.img} ratio="r32" tone={p.tone} obj={p.obj} alt={`Cover image for ${p.title}`} />
      <div className="stack" style={{ gap: 8 }}>
        <span className="cat">{p.category}</span>
        <h3 className="h4 hl">{p.title}</h3>
        <p className="md">{p.description}</p>
        <p className="meta">{p.date} · {p.read}</p>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [featured, ...rest] = getAllPosts();
  return (
    <main id="main">
      <PageHero
        title="Blog"
        lead="Blender lighting tutorials, project breakdowns and practical guides on product CGI, for artists and the brands who hire them."
      />

      <section className="sec-tight" style={{ paddingTop: 0 }} aria-labelledby="feat-h">
        <div className="wrap">
          <Link href={`/blog/${featured.slug}`} className="card-link feature">
            <Render src={featured.img} sizes="(max-width: 720px) 100vw, 50vw" ratio="r32" tone={featured.tone} obj={featured.obj} alt={`Cover image for ${featured.title}`} />
            <div className="stack" style={{ gap: 16 }}>
              <span className="cat">{featured.category}</span>
              <h2 className="h2 hl" id="feat-h">{featured.title}</h2>
              <p className="body">{featured.description}</p>
              <p className="meta">{featured.date} · {featured.read}</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="sec" aria-labelledby="all-h">
        <div className="wrap">
          <h2 className="h2" id="all-h" style={{ marginBottom: 32 }}>All articles</h2>
          <Filter
            label="Filter by type"
            categories={POST_CATEGORIES}
            gridClass="g2"
            items={rest.map((p) => ({ key: p.slug, category: p.category, node: <PostCard p={p} /> }))}
          />
        </div>
      </section>
    </main>
  );
}
