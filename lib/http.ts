import { SITE_URL } from './site';

// Shared request hardening for API routes.

export class TooLarge extends Error {}

/** Read a request body as text, stopping (and throwing TooLarge) past `max` bytes.
 *  Unlike req.text(), a huge or chunked body is never buffered in full. */
export async function readCapped(req: Request, max: number) {
  const reader = req.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel().catch(() => {});
      throw new TooLarge();
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

// Control characters (keeps \n and \t for multi-line text).
// Built with RegExp() from escaped strings so the source stays ASCII: bundlers can turn
// line-separator escapes inside a regex literal into real line breaks, which breaks it.
const CONTROL = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');
// Line breaks, zero-width and bidi-override characters: never wanted in single-line fields
// (they enable email header injection and text-direction spoofing downstream).
const SINGLE_LINE_UNSAFE = new RegExp('[\\r\\n\\u2028\\u2029\\u200B-\\u200F\\u202A-\\u202E\\u2066-\\u2069\\uFEFF]', 'g');
const BIDI = new RegExp('[\\u202A-\\u202E\\u2066-\\u2069]', 'g');

/** A single-line text field: non-strings become '', unsafe characters are removed. */
export function cleanLine(v: unknown, max: number) {
  if (typeof v !== 'string') return '';
  return v.replace(CONTROL, '').replace(SINGLE_LINE_UNSAFE, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max);
}

/** Multi-line text: keeps line breaks, drops control and bidi-override characters. */
export function cleanText(v: unknown, max: number) {
  if (typeof v !== 'string') return '';
  return v.replace(CONTROL, '').replace(BIDI, '').trim().slice(0, max);
}

/** True when the request comes from this site's own pages.
 *  Browsers always send Origin on cross-site POSTs; Sec-Fetch-Site covers the rest. */
export function fromThisSite(req: Request) {
  const origin = req.headers.get('origin');
  const fetchSite = req.headers.get('sec-fetch-site');
  if (!origin) return fetchSite === null || fetchSite === 'same-origin' || fetchSite === 'none';
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = new Set(
    [new URL(SITE_URL).host, req.headers.get('x-forwarded-host'), req.headers.get('host')].filter(Boolean) as string[]
  );
  return allowed.has(host);
}

export const isJson = (req: Request) => (req.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json');
