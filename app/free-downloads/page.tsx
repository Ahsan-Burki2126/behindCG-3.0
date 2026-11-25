import Link from 'next/link';
import { PageHero } from '@/components/Blocks';
import Icon from '@/components/Icon';
import Render from '@/components/Render';
import { DOWNLOADS } from '@/lib/catalog';
import HeroVisual from '@/components/HeroVisual';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/free-downloads');

export default function FreeDownloads() {
  return (
    <main id="main">
      <PageHero
        title="Free Blender scene files"
        lead="Product scenes, studio lighting starters and gobo samples based on our studio setups. Free to download and learn from."
        visual={
          <HeroVisual main={{ src: '/images/downloads/studio-product-scene.jpg', tone: 'teal', obj: 'bottle', alt: 'Studio product scene rendered in Blender' }} inset={{ src: '/images/downloads/glass-lighting-starter.jpg', tone: 'cool', obj: 'jar', alt: 'Glass lighting starter scene' }} chip={{ icon: 'download', text: 'Free .blend files' }} />
        }
      >
        <Link className="btn btn-secondary" href="/membership">Get a new scene every month</Link>
      </PageHero>

      <section className="sec" style={{ paddingTop: 0 }} aria-label="Downloads">
        <div className="wrap g3">
          {DOWNLOADS.map((d) => (
            <article key={d.title} className="card">
              <Render src={d.img} ratio="r43" tone={d.tone} obj={d.obj} alt={`${d.title} rendered in Blender`} />
              <div className="card-body">
                <h2 className="h4">{d.title}</h2>
                <p className="md">{d.text}</p>
                <p className="meta">{d.format} · {d.size}</p>
                <div className="card-foot">
                  {d.url ? (
                    <a className="btn btn-secondary btn-block" href={d.url} download>
                      <Icon name="download" />Download {d.format}
                    </a>
                  ) : (
                    <button className="btn btn-block" type="button" disabled>File coming soon</button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sec mist" aria-labelledby="lic-h">
        <div className="wrap narrow stack" style={{ gap: 16, alignItems: 'flex-start' }}>
          <h2 className="h3" id="lic-h">What you can do with the files</h2>
          <p className="body">
            Learn from them, render them and post the results. Do not resell or redistribute the scene files themselves.
            The full terms are on the licences page.
          </p>
          <Link className="btn btn-ghost" href="/licenses">Read the licence<Icon name="arrow" /></Link>
        </div>
      </section>
    </main>
  );
}
