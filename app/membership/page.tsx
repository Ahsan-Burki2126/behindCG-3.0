import Link from 'next/link';
import Accordion from '@/components/Accordion';
import Icon from '@/components/Icon';
import { PageHero, SectionHead } from '@/components/Blocks';
import { PLANS, PLAN_ROWS } from '@/lib/catalog';
import { pageMetadata } from '@/lib/seo';
import { checkoutLink } from '@/lib/commerce/products';
import { SITE } from '@/lib/site';

export const metadata = pageMetadata('/membership');

// Checkout links come from lib/commerce/products.ts (Lemon Squeezy).
const joinUrl = (plan: string) => checkoutLink(plan === 'Pro' ? 'membership:pro' : 'membership:basic');

const faq = [
  { q: 'Can I cancel any time?', a: 'Yes. You keep access until the end of the period you paid for. [confirm]' },
  { q: 'Do I keep the scene files if I cancel?', a: 'Files you downloaded while a member stay yours to use under the licence. [confirm]' },
  { q: 'I support Behind CG on Patreon. Is that the same?', a: '[Explain how Patreon tiers map to Basic and Pro.]' },
  { q: 'Can I switch between Basic and Pro?', a: 'Yes, from your account. The change applies from your next billing date. [confirm]' },
];

export default function Membership() {
  return (
    <main id="main">
      <PageHero
        title="Membership for Blender artists"
        lead="A new studio scene file every month, breakdown tutorials, courses and member pricing on addons. Choose Basic or Pro."
      />

      <section className="sec" style={{ paddingTop: 0 }} aria-label="Plans">
        <div className="wrap">
          <div className="plans">
            {PLANS.map((p) => (
              <article key={p.name} className={`card plan${p.featured ? ' is-featured' : ''}`}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <h2 className="h3">{p.name}</h2>
                  {p.featured && <span className="badge b-teal">Most complete</span>}
                </div>
                <p className="md">{p.text}</p>
                <p>
                  <span className="plan-price">{p.price}</span> <span className="sm">{p.period}</span>
                </p>
                <ul className="dots">
                  {p.perks.map((k) => <li key={k}>{k}</li>)}
                </ul>
                {joinUrl(p.name) ? (
                  <a className={`btn btn-block ${p.featured ? 'btn-primary' : 'btn-secondary'}`} href={joinUrl(p.name)}>
                    Join {p.name}
                  </a>
                ) : (
                  <button className="btn btn-block" type="button" disabled>{p.name} opens soon</button>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec mist" aria-labelledby="cmp-h">
        <div className="wrap narrow">
          <SectionHead id="cmp-h" title="Compare plans" />
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr><th scope="col">Feature</th><th scope="col">Basic</th><th scope="col">Pro</th></tr>
              </thead>
              <tbody>
                {PLAN_ROWS.map((r) => (
                  <tr key={r.label}><th scope="row">{r.label}</th><td>{r.basic}</td><td>{r.pro}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="mfaq-h">
        <div className="wrap narrow">
          <SectionHead id="mfaq-h" title="Membership questions" />
          <Accordion items={faq} />
        </div>
      </section>

      <section className="sec-tight" id="sign-in" aria-labelledby="signin-h">
        <div className="wrap">
          <div className="close">
            <h2 className="h2" id="signin-h">Already a member?</h2>
            <p className="md">Sign in with the email you paid with to get your files, courses and billing settings. Patreon supporters keep getting their files on Patreon.</p>
            <div className="row">
              <Link className="btn btn-primary" href="/sign-in?next=/account" prefetch={false}>Sign in</Link>
              <a className="btn btn-ghost" href={SITE.social.patreon} target="_blank" rel="noopener">Go to Patreon<Icon name="arrow" /></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
