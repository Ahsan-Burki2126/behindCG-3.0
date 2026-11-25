import { NextResponse } from 'next/server';
import { cleanLine, cleanText, fromThisSite, isJson, readCapped, TooLarge } from '@/lib/http';
import { validateQuote, type QuoteInput } from '@/lib/quote';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { SITE_URL } from '@/lib/site';

// Receives quote requests and forwards them to QUOTE_WEBHOOK_URL (an n8n webhook,
// for example, which can email the studio and add the lead to a CRM).
const MAX_BYTES = 32 * 1024;
const WEBHOOK_TIMEOUT_MS = 8000;
const TEN_MIN = 10 * 60 * 1000;

const tooMany = (retryAfter: number) =>
  NextResponse.json({ error: 'Too many requests. Try again in a few minutes.' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });

export async function POST(req: Request) {
  if (!fromThisSite(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!isJson(req)) return NextResponse.json({ error: 'Send JSON' }, { status: 415 });
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BYTES) return NextResponse.json({ error: 'Request too large' }, { status: 413 });

  const ip = clientIp(req);
  // Loose limit on every attempt (typos and validation errors included)…
  const any = rateLimit(`quote-any:${ip}`, 20, TEN_MIN);
  if (!any.ok) return tooMany(any.retryAfter);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(await readCapped(req, MAX_BYTES));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch (err) {
    if (err instanceof TooLarge) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const input: QuoteInput = {
    name: cleanLine(body.name, 200),
    email: cleanLine(body.email, 320),
    company: cleanLine(body.company, 200),
    services: Array.isArray(body.services) ? body.services.slice(0, 10).map((s) => cleanLine(s, 60)).filter(Boolean) : [],
    details: cleanText(body.details, 6000),
    budget: cleanLine(body.budget, 100),
    launch: cleanLine(body.launch, 20),
    files: cleanLine(body.files, 2000),
    consent: body.consent === true,
    website: cleanLine(body.website, 200),
  };

  // Bots fill the hidden field. Answer as if it worked so they do not retry.
  if (input.website) return NextResponse.json({ ok: true });

  const errors = validateQuote(input);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  // …and a strict limit on requests that would actually be delivered.
  const sent = rateLimit(`quote-sent:${ip}`, 5, TEN_MIN);
  if (!sent.ok) return tooMany(sent.retryAfter);

  const { website: _honeypot, ...lead } = input;
  const webhook = process.env.QUOTE_WEBHOOK_URL;

  if (!webhook) {
    // Never pretend a lead was delivered in production.
    if (process.env.NODE_ENV === 'production') {
      console.error('QUOTE_WEBHOOK_URL is not set: quote request not delivered');
      return NextResponse.json({ error: 'Quote delivery is not configured' }, { status: 503 });
    }
    console.info('[dev] quote request', lead);
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.QUOTE_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.QUOTE_WEBHOOK_SECRET}` } : {}),
      },
      body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString(), source: `${new URL(SITE_URL).host}/get-a-quote` }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error('Quote webhook failed', err);
    return NextResponse.json({ error: 'Could not deliver request' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
