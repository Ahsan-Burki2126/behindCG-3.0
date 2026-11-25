import Link from 'next/link';
import Accordion, { type QA } from '@/components/Accordion';
import { PageHero } from '@/components/Blocks';
import JsonLd from '@/components/JsonLd';
import { faqPage } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = pageMetadata('/faq');

const groups: { id: string; title: string; items: QA[] }[] = [
  {
    id: 'projects',
    title: 'Client projects',
    items: [
      { q: 'How much do 3D product renders cost?', a: 'It depends on the number of shots, the complexity of the product and the scenes. Packshot sets start from $[000]. Send a brief and you get a fixed quote within two working days.' },
      { q: 'How long does a project take?', a: 'Most render projects take [00] to [00] working days from an approved brief; films take longer. Your quote includes a delivery date.' },
      { q: 'What do you need from us?', a: 'CAD files are fastest. Dielines, photos from several angles or a physical sample also work. Add references for the look you want.' },
      { q: 'How many revisions are included?', a: '[Number] rounds at each stage: clay previews, look development and final. Changes to the brief after approval are quoted separately.' },
      { q: 'Can we use the renders anywhere?', a: 'Yes. Full commercial usage rights transfer on final payment. See the terms.' },
    ],
  },
  {
    id: 'addons',
    title: 'Addons and licences',
    items: [
      { q: 'Which Blender versions are supported?', a: 'Each addon page lists the supported versions. We test on the current LTS release.' },
      { q: 'How do I install an addon?', a: 'In Blender, open Edit > Preferences > Add-ons, choose Install from Disk and pick the .zip file you downloaded. Do not unzip it first.' },
      { q: 'What is the difference between Personal and Studio licences?', a: 'Personal covers one artist, including paid client work. Studio covers a team. The licences page has the details.' },
      { q: 'How do I get updates?', a: 'Download the latest version from wherever you bought the addon. Updates are free.' },
    ],
  },
  {
    id: 'learning',
    title: 'Courses and membership',
    items: [
      { q: 'Do I keep access to a course?', a: '[Lifetime access or a set period: confirm.]' },
      { q: 'What level are the courses?', a: 'Each course lists its level. You should know the Blender interface before starting an intermediate course.' },
      { q: 'How do Basic and Pro differ?', a: 'The membership page has a full comparison.' },
    ],
  },
  {
    id: 'refunds',
    title: 'Payments and refunds',
    items: [
      { q: 'Can I get a refund on an addon or course?', a: '[Refund window and conditions: confirm with the terms.]' },
      { q: 'How do client project payments work?', a: '[Deposit and balance terms: confirm.]' },
    ],
  },
];

export default function Faq() {
  return (
    <main id="main">
      <JsonLd data={faqPage(groups.flatMap((g) => g.items))} />
      <PageHero
        title="FAQ and support"
        lead="Answers on render pricing and timelines, addon licences and installation, courses, membership and refunds."
      />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <div className="stack" style={{ gap: 80 }}>
            {groups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} style={{ scrollMarginTop: 112 }}>
                <h2 className="h3" id={`${g.id}-h`} style={{ marginBottom: 16 }}>{g.title}</h2>
                <Accordion items={g.items} />
              </section>
            ))}
          </div>
          <aside className="aside">
            <nav className="toc" aria-label="FAQ sections">
              {groups.map((g) => <a key={g.id} href={`#${g.id}`}>{g.title}</a>)}
            </nav>
            <div className="card" style={{ padding: 32, gap: 12 }}>
              <h2 className="h4">Still stuck?</h2>
              <p className="md">
                Email <a href={`mailto:${SITE.email.support}`}>{SITE.email.support}</a> for addon, course and
                membership help. For projects, use the quote form.
              </p>
              <Link className="btn btn-secondary" href="/get-a-quote">Get a Quote</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
