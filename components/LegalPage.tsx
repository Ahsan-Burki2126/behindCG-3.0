import { PageHero } from './Blocks';

// Legal page layout: prose column plus a sticky table of contents.
// The text is a starting draft, not legal advice. Have it reviewed before launch.
export type LegalSection = { id: string; title: string; body: React.ReactNode };

export default function LegalPage({ title, lead, updated, sections, children }: {
  title: string;
  lead: string;
  updated: string;
  sections: LegalSection[];
  children?: React.ReactNode;
}) {
  return (
    <main id="main">
      <PageHero title={title} lead={lead} />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <article className="prose">
            <p className="meta">Last updated {updated}</p>
            {children}
            {sections.map((s) => (
              <section key={s.id} id={s.id} style={{ scrollMarginTop: 112 }}>
                <h2>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </article>
          <aside className="aside">
            <nav className="toc" aria-label="On this page">
              {sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}
            </nav>
          </aside>
        </div>
      </section>
    </main>
  );
}
