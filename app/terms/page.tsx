import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = pageMetadata('/terms');

export default function Terms() {
  return (
    <LegalPage
      title="Terms and refunds"
      lead="Terms for Behind CG client projects, digital products and membership, including payment, usage rights and the refund policy."
      updated="[Date]"
      sections={[
        {
          id: 'about',
          title: 'About these terms',
          body: <p>These terms apply between you and [Legal business name], trading as {SITE.name}. They are governed by the laws of [Jurisdiction].</p>,
        },
        {
          id: 'projects',
          title: 'Client projects',
          body: (
            <ul>
              <li>Each project follows a written quote with scope, price, revisions and delivery date.</li>
              <li>Payment: [deposit]% to start, the balance on delivery. Invoices are due in [00] days.</li>
              <li>Changes after approval of a stage are quoted separately.</li>
              <li>Usage rights to the final renders and films transfer to you on full payment. Source files are not included unless the quote says so.</li>
            </ul>
          ),
        },
        {
          id: 'products',
          title: 'Digital products',
          body: <p>Addons, scene files and courses are licensed, not sold. What you can do with each is set out on the <Link href="/licenses">licences page</Link>.</p>,
        },
        {
          id: 'membership',
          title: 'Membership',
          body: <p>Memberships renew automatically each [month] until cancelled. Cancel any time; access continues to the end of the paid period. [Confirm with the chosen platform.]</p>,
        },
        {
          id: 'refunds',
          title: 'Refunds',
          body: (
            <ul>
              <li>Addons and scene files: [refund window and conditions].</li>
              <li>Courses: [refund window and conditions].</li>
              <li>Client projects: deposits cover work started and are [refundable/non-refundable] once work begins.</li>
              <li>Ask for a refund at <a href={`mailto:${SITE.email.support}`}>{SITE.email.support}</a>.</li>
            </ul>
          ),
        },
        {
          id: 'liability',
          title: 'Liability',
          body: <p>[Limitation of liability clause, to be written in legal review.]</p>,
        },
      ]}
    />
  );
}
