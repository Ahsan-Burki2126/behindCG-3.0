'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Icon from './Icon';
import { QUOTE_BUDGETS, QUOTE_SERVICES, validateQuote, type QuoteErrors, type QuoteInput } from '@/lib/quote';
import { SITE } from '@/lib/site';

// Contact artboard: inline errors, an error summary that takes focus, aria-invalid,
// and a loading state on the submit button. Validation is shared with /api/quote.
export default function QuoteForm() {
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input: QuoteInput = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      services: fd.getAll('services').map(String),
      details: String(fd.get('details') ?? ''),
      budget: String(fd.get('budget') ?? ''),
      launch: String(fd.get('launch') ?? ''),
      files: String(fd.get('files') ?? ''),
      consent: fd.get('consent') === 'on',
      website: String(fd.get('website') ?? ''),
    };

    const found = validateQuote(input);
    setErrors(found);
    setFailed(false);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(String(res.status));
      router.push('/thank-you');
    } catch {
      setFailed(true);
      setSending(false);
    }
  }

  const err = (k: keyof QuoteErrors) =>
    errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${k}-err`, className: 'input is-err' } : { className: 'input' };
  const count = Object.keys(errors).length;

  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      <p className="sm">Fields marked <span className="req" aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.</p>
      {count > 0 && (
        <div className="alert alert-err" role="alert" tabIndex={-1} ref={summaryRef}>
          <Icon name="alert" />
          <div>
            <p><strong>{count === 1 ? 'One thing needs fixing' : `${count} things need fixing`} before we can send this:</strong></p>
            <ul>
              {Object.entries(errors).map(([k, msg]) => (
                <li key={k}><a href={`#${k === 'services' ? 'services-0' : k}`}>{msg}</a></li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {failed && (
        <div className="alert alert-err" role="alert">
          <Icon name="alert" />
          <p>
            Your request did not send. Nothing you typed is lost: try again, or email{' '}
            <a href={`mailto:${SITE.email.hello}`}>{SITE.email.hello}</a>.
          </p>
        </div>
      )}

      <div className="fg-row">
        <div className="fg">
          <label htmlFor="name">Your name <span className="req" aria-hidden="true">*</span></label>
          <input id="name" name="name" autoComplete="name" placeholder="e.g. Alex Morgan" required {...err('name')} />
          {errors.name && <p className="err" id="name-err">{errors.name}</p>}
        </div>
        <div className="fg">
          <label htmlFor="email">Work email <span className="req" aria-hidden="true">*</span></label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="e.g. alex@brand.com" required {...err('email')} />
          {errors.email && <p className="err" id="email-err">{errors.email}</p>}
        </div>
      </div>

      <div className="fg">
        <label htmlFor="company">Brand or company</label>
        <input id="company" name="company" autoComplete="organization" placeholder="e.g. Northwind Skincare" className="input" />
      </div>

      <fieldset className="chips" aria-describedby={errors.services ? 'services-err' : undefined}>
        <legend>What do you need? <span className="req" aria-hidden="true">*</span></legend>
        {QUOTE_SERVICES.map((s, i) => (
          <label key={s} className="chip">
            <input type="checkbox" name="services" value={s} id={`services-${i}`} aria-invalid={errors.services ? true : undefined} aria-describedby={errors.services ? 'services-err' : undefined} />
            <span>{s}</span>
          </label>
        ))}
        {errors.services && <p className="err" id="services-err" style={{ flexBasis: '100%' }}>{errors.services}</p>}
      </fieldset>

      <div className="fg">
        <label htmlFor="details">Tell us about the product <span className="req" aria-hidden="true">*</span></label>
        <textarea
          id="details"
          name="details"
          rows={6}
          placeholder="e.g. A 50 ml frosted glass serum bottle. We need 6 packshots and 2 lifestyle scenes for Amazon and our Shopify store."
          required
          {...err('details')}
          aria-describedby={errors.details ? 'details-err' : 'details-help'}
        />
        {errors.details ? (
          <p className="err" id="details-err">{errors.details}</p>
        ) : (
          <p className="help" id="details-help">What it is, how many images or seconds of film, and where they will be used.</p>
        )}
      </div>

      <div className="fg-row">
        <div className="fg">
          <label htmlFor="budget">Budget</label>
          <select id="budget" name="budget" className="input" defaultValue="">
            <option value="">Not sure yet</option>
            {QUOTE_BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="fg">
          <label htmlFor="launch">Launch or deadline</label>
          <input id="launch" name="launch" type="date" className="input" />
        </div>
      </div>

      <div className="fg">
        <label htmlFor="files">Link to files</label>
        <input
          id="files"
          name="files"
          type="url"
          inputMode="url"
          placeholder="https://drive.google.com/..."
          aria-describedby={errors.files ? 'files-err' : 'files-help'}
          {...err('files')}
        />
        {errors.files ? (
          <p className="err" id="files-err">{errors.files}</p>
        ) : (
          <p className="help" id="files-help">CAD files, dielines, photos or references. A shared folder link is fine.</p>
        )}
      </div>

      {/* Honeypot: hidden from people, filled by bots */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="fg">
        <label className="check" htmlFor="consent">
          <input id="consent" name="consent" type="checkbox" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? 'consent-err' : undefined} />
          <span>
            I agree that Behind CG can use these details to reply to my request, as set out in the{' '}
            <Link href="/privacy">privacy policy</Link>.
          </span>
        </label>
        {errors.consent && <p className="err" id="consent-err">{errors.consent}</p>}
      </div>

      <div>
        <button className="btn btn-primary" type="submit" disabled={sending} aria-disabled={sending}>
          {sending ? (<><span className="spin" aria-hidden="true" />Sending request</>) : 'Send quote request'}
        </button>
      </div>
    </form>
  );
}
