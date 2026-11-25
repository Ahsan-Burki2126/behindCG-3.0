import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';

// Lemon Squeezy → product → "Redirect after purchase": https://<your-domain>/welcome
export const metadata: Metadata = {
  title: 'Thanks for your purchase',
  description: 'Your Behind CG order is confirmed.',
  robots: { index: false, follow: false },
};

export default function Welcome() {
  return (
    <main id="main">
      <section className="sec">
        <div className="wrap narrow stack" style={{ gap: 24, alignItems: 'flex-start' }}>
          <span className="icon-tile"><Icon name="check" /></span>
          <h1 className="h1">Thanks, your order is confirmed</h1>
          <ul className="checks welcome-steps">
            <li><span className="check-ic"><Icon name="mail" /></span>Your receipt is on its way by email. Addon purchases include the download and your licence key.</li>
            <li><span className="check-ic"><Icon name="check" /></span>Membership and courses: sign in with the same email you used at checkout. Access appears within a minute.</li>
          </ul>
          <div className="row">
            <Link className="btn btn-primary" href="/sign-in?next=/account">Sign in to your account</Link>
            <Link className="btn btn-ghost" href="/faq#addons">Install help<Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
