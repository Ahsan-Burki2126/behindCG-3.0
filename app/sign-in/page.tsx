import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { authEnabled } from '@/lib/commerce/config';
import { SITE } from '@/lib/site';
import { currentUser, safeNext } from '@/lib/supabase/server';
import SignInForm from './SignInForm';

export const metadata: Metadata = {
  title: 'Member sign-in',
  description: 'Sign in to your Behind CG account for membership files, courses and purchases.',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function SignIn({ searchParams }: Props) {
  const { next: rawNext, error } = await searchParams;
  const next = safeNext(rawNext);
  if (authEnabled && (await currentUser())) redirect(next);

  return (
    <main id="main">
      <section className="sec">
        <div className="wrap narrow signin">
          <div className="stack" style={{ gap: 16 }}>
            <h1 className="h1">Member sign-in</h1>
            <p className="lead">No password needed: we email you a one-time link.</p>
          </div>
          {!authEnabled ? (
            <div className="close">
              <h2 className="h3">Member accounts open soon</h2>
              <p className="md">Until then, Patreon supporters get their files on Patreon, and addon buyers get downloads and licence keys by email.</p>
              <div className="row">
                <a className="btn btn-secondary" href={SITE.social.patreon} target="_blank" rel="noopener">Go to Patreon</a>
                <Link className="btn btn-ghost" href="/membership">See membership plans</Link>
              </div>
            </div>
          ) : (
            <>
              {error === 'link' && (
                <div className="alert alert-err" role="alert">
                  <p>That sign-in link has expired or was already used. Enter your email to get a new one.</p>
                </div>
              )}
              <SignInForm next={next} />
              <p className="sm">
                Not a member yet? <Link href="/membership">Compare plans</Link>. Need help? <a href={`mailto:${SITE.email.support}`}>{SITE.email.support}</a>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
