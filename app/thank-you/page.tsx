import Link from 'next/link';
import Icon from '@/components/Icon';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/thank-you');

export default function ThankYou() {
  return (
    <main id="main">
      <section className="sec">
        <div className="wrap narrow stack" style={{ gap: 24, alignItems: 'flex-start' }}>
          <span className="icon-tile"><Icon name="check" /></span>
          <h1 className="h1">Thanks, your quote request is in</h1>
          <p className="lead">
            We read every brief ourselves and reply within two working days with a plan and a fixed quote. Check your
            spam folder if nothing arrives.
          </p>
          <div className="row">
            <Link className="btn btn-primary" href="/portfolio">See recent work</Link>
            <Link className="btn btn-ghost" href="/">Back to home<Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
