// Quote request fields and validation, shared by the form and /api/quote.

export const QUOTE_SERVICES = ['Product renders', 'Product animation', 'Blender addon', 'AI or social automation'] as const;
export const QUOTE_BUDGETS = ['Under $[1,000]', '$[1,000] to $[3,000]', '$[3,000] to $[10,000]', 'Over $[10,000]'] as const; // [replace]

export type QuoteInput = {
  name: string;
  email: string;
  company: string;
  services: string[];
  details: string;
  budget: string;
  launch: string;
  files: string;
  consent: boolean;
  website: string; // honeypot
};

export type QuoteErrors = Partial<Record<'name' | 'email' | 'services' | 'details' | 'files' | 'consent', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Each message names the problem and the fix.
export function validateQuote(q: QuoteInput): QuoteErrors {
  const e: QuoteErrors = {};
  if (!q.name.trim()) e.name = 'Enter your name so we know who to reply to.';
  if (!q.email.trim()) e.email = 'Enter your email address so we can send the quote.';
  else if (!EMAIL.test(q.email.trim())) e.email = 'Enter an email address in the format name@company.com.';
  if (!q.services.length) e.services = 'Choose at least one thing you need.';
  else if (q.services.some((s) => !(QUOTE_SERVICES as readonly string[]).includes(s))) e.services = 'Choose from the listed options.';
  if (q.details.trim().length < 20) e.details = 'Describe the product in a sentence or two (at least 20 characters).';
  if (q.details.length > 5000) e.details = 'Keep the description under 5,000 characters. Put longer briefs in the files link.';
  if (q.files.trim()) {
    try {
      const u = new URL(q.files.trim());
      if (!/^https?:$/.test(u.protocol)) throw new Error();
    } catch {
      e.files = 'Enter the full link, starting with https://.';
    }
  }
  if (!q.consent) e.consent = 'Tick the box so we can use your details to reply.';
  return e;
}
