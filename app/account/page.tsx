import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Icon from '@/components/Icon';
import { COURSES } from '@/lib/catalog';
import { canAccessCourse, canDownload, isLive, membershipTier } from '@/lib/commerce/access';
import { authEnabled, storeEnabled } from '@/lib/commerce/config';
import { checkoutLink, MEMBER_FILES, productByKey } from '@/lib/commerce/products';
import { entitlementsFor } from '@/lib/commerce/store';
import { SITE } from '@/lib/site';
import { currentUser } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Your account', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

export default async function Account() {
  if (!authEnabled) {
    return (
      <main id="main">
        <section className="sec">
          <div className="wrap narrow close">
            <h1 className="h2">Member accounts open soon</h1>
            <p className="md">Addon purchases are delivered by email with your licence key. Membership and course access will appear here once accounts are live.</p>
            <Link className="btn btn-secondary" href="/membership">See membership plans</Link>
          </div>
        </section>
      </main>
    );
  }

  const user = await currentUser();
  if (!user?.email) redirect('/sign-in?next=/account');
  const email = user.email;
  const ents = await entitlementsFor(email);
  const tier = membershipTier(ents);
  const membership = ents.find((e) => e.key.startsWith('membership:') && isLive(e)) ?? ents.find((e) => e.key.startsWith('membership:'));
  const courses = COURSES.filter((c) => c.slug);
  const addons = ents.filter((e) => e.key.startsWith('addon:') && isLive(e));

  return (
    <main id="main">
      <section className="page-hero">
        <div className="wrap account-head">
          <div className="stack" style={{ gap: 12 }}>
            <h1 className="h1">Your account</h1>
            <p className="lead">Signed in as {email}</p>
          </div>
          <form action="/auth/sign-out" method="post">
            <button className="btn btn-secondary" type="submit">Sign out</button>
          </form>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap account-grid">
          {!storeEnabled && (
            <div className="alert alert-err" role="status" style={{ gridColumn: '1 / -1' }}>
              <p>Purchases can&apos;t be shown yet because the store isn&apos;t connected. Your downloads and licence keys are in your Lemon Squeezy emails.</p>
            </div>
          )}

          <article className="card acct-card">
            <span className="cat">Membership</span>
            {tier ? (
              <>
                <h2 className="h3">{tier === 'pro' ? 'Pro' : 'Basic'} member</h2>
                <p className="md">
                  {membership?.status === 'cancelled' && membership.ends_at
                    ? `Cancelled. Access continues until ${fmt(membership.ends_at)}.`
                    : membership?.renews_at
                      ? `Renews on ${fmt(membership.renews_at)}.`
                      : 'Active.'}
                  {membership?.status === 'past_due' && ' Your last payment failed: update your card to keep access.'}
                </p>
                {membership?.portal_url && (
                  <a className="btn btn-secondary" href={membership.portal_url} target="_blank" rel="noopener">Manage billing</a>
                )}
              </>
            ) : (
              <>
                <h2 className="h3">No active membership</h2>
                <p className="md">Get a new studio scene every month, breakdowns and member pricing.</p>
                <div className="row">
                  {checkoutLink('membership:pro', email) && <a className="btn btn-primary" href={checkoutLink('membership:pro', email)}>Join Pro</a>}
                  <Link className="btn btn-ghost" href="/membership">Compare plans<Icon name="arrow" /></Link>
                </div>
              </>
            )}
          </article>

          <article className="card acct-card">
            <span className="cat">Courses</span>
            <ul className="acct-list">
              {courses.map((c) => {
                const ok = canAccessCourse(ents, c.slug!);
                const buy = checkoutLink(`course:${c.slug}`, email);
                return (
                  <li key={c.slug}>
                    <span className="h5">{c.title}</span>
                    {ok ? (
                      <Link className="btn btn-primary" href={`/learn/${c.slug}`}>Open course</Link>
                    ) : buy ? (
                      <a className="btn btn-secondary" href={buy}>Buy course</a>
                    ) : (
                      <span className="meta">Included in Pro</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>

          <article className="card acct-card">
            <span className="cat">Member files</span>
            <ul className="acct-list">
              {MEMBER_FILES.map((f) => (
                <li key={f.id}>
                  <span className="stack" style={{ gap: 2 }}>
                    <span className="h5">{f.title}</span>
                    <span className="meta">{f.size}</span>
                  </span>
                  {canDownload(ents, f) ? (
                    <a className="btn btn-secondary" href={`/api/member/download?id=${encodeURIComponent(f.id)}`}><Icon name="download" />Download</a>
                  ) : (
                    <span className="meta">{f.access === 'membership' ? 'Members only' : 'Course buyers'}</span>
                  )}
                </li>
              ))}
            </ul>
          </article>

          <article className="card acct-card">
            <span className="cat">Addon purchases</span>
            {addons.length ? (
              <ul className="acct-list">
                {addons.map((a) => (
                  <li key={a.source_id}>
                    <span className="h5">{productByKey(a.key)?.name ?? a.key}</span>
                    <span className="meta">Licence key and download in your email</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="md">No addons yet. <Link href="/addons">Browse addons</Link>.</p>
            )}
            <a className="btn btn-ghost" href="https://app.lemonsqueezy.com/my-orders" target="_blank" rel="noopener">All orders and receipts<Icon name="arrow" /></a>
          </article>
        </div>
        <p className="wrap sm" style={{ marginTop: 32 }}>
          Something missing? Purchases appear within a minute of paying, under the email you used at checkout. Email <a href={`mailto:${SITE.email.support}`}>{SITE.email.support}</a>.
        </p>
      </section>
    </main>
  );
}
