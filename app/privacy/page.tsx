import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = pageMetadata('/privacy');

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      lead="How Behind CG collects, uses and protects your data, which cookies we set, and how to access or delete your information."
      updated="[Date]"
      sections={[
        {
          id: 'who',
          title: 'Who we are',
          body: <p>This site is run by [Legal business name], trading as {SITE.name} ("we"). Contact us about privacy at <a href={`mailto:${SITE.email.privacy}`}>{SITE.email.privacy}</a>.</p>,
        },
        {
          id: 'collect',
          title: 'What we collect',
          body: (
            <ul>
              <li><strong>Quote requests:</strong> your name, email, company and the project details you send.</li>
              <li><strong>Purchases and membership:</strong> your name, email and order history. Payments are handled by Lemon Squeezy, which acts as the seller of record; we never see your card number. Member sign-in and purchase records are stored with Supabase.</li>
              <li><strong>Usage data:</strong> if analytics are switched on, pages visited and the referring site, measured with [Umami or Plausible], which does not use cookies or store personal data.</li>
            </ul>
          ),
        },
        {
          id: 'use',
          title: 'How we use it',
          body: (
            <ul>
              <li>To reply to your request and run your project (contract, or steps you asked for before one).</li>
              <li>To deliver products, updates and support you bought (contract).</li>
              <li>To understand which pages help visitors (legitimate interest, or consent where required).</li>
            </ul>
          ),
        },
        {
          id: 'cookies',
          title: 'Cookies',
          body: <p>We use essential storage to remember your cookie choice and, if you sign in, an essential cookie that keeps you signed in. Analytics cookies are set only if you accept them. Change your choice any time with Cookie settings in the footer.</p>,
        },
        {
          id: 'sharing',
          title: 'Who we share it with',
          body: <p>Service providers that run the site and our business: hosting (Hostinger), payments (Lemon Squeezy), member accounts and purchase records (Supabase), [email provider for sign-in links], [workflow automation (n8n) hosting] and, if enabled, cookieless analytics ([Umami or Plausible]). We do not sell your data.</p>,
        },
        {
          id: 'keep',
          title: 'How long we keep it',
          body: <p>Quote requests: [00] months after the last contact. Customer records: as long as tax law requires, currently [00] years in [Jurisdiction].</p>,
        },
        {
          id: 'rights',
          title: 'Your rights',
          body: <p>You can ask to see, correct, export or delete your data, or object to how we use it. Email <a href={`mailto:${SITE.email.privacy}`}>{SITE.email.privacy}</a>. You can also complain to your local data protection authority.</p>,
        },
      ]}
    />
  );
}
