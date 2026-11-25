import Icon from '@/components/Icon';
import QuoteForm from '@/components/QuoteForm';
import { pageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = pageMetadata('/get-a-quote');

const next = [
  'We read your brief and reply within two working days.',
  'You get a shot list, a schedule and a fixed price.',
  'Work starts when you approve the quote. Clay previews come first.',
];

export default function GetAQuote() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="wrap">
          <h1 className="h1">Get a Quote</h1>
          <p className="lead">
            Tell us about your product and your launch date. We reply with a plan and a fixed quote for renders or
            animation within two working days.
          </p>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap quote">
          <QuoteForm />
          <aside className="aside">
            <div className="card" style={{ padding: 32, gap: 24 }}>
              <h2 className="h4">What happens next</h2>
              <ol className="side-list">
                {next.map((n) => (
                  <li key={n} className="md">
                    <Icon name="check" />
                    <span>{n}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card" style={{ padding: 32, gap: 12 }}>
              <h2 className="h4">Rather email?</h2>
              <p className="md">
                Write to <a href={`mailto:${SITE.email.hello}`}>{SITE.email.hello}</a>. For addon, course or
                membership help, email <a href={`mailto:${SITE.email.support}`}>{SITE.email.support}</a>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
