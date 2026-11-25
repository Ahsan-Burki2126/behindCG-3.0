// Small in-memory sliding-window limiter. Enough for one Node process (Hostinger Node.js
// apps run one). If you scale to several instances, move this to Redis or similar.
const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep memory bounded: drop expired keys, then the oldest ones (Map keeps insertion order).
  if (hits.size > MAX_KEYS) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    for (const k of hits.keys()) {
      if (hits.size <= MAX_KEYS * 0.8) break;
      hits.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}

// The visitor's IP as seen by YOUR proxy. Clients can put anything at the start of
// X-Forwarded-For, but each trusted proxy appends the address it saw, so we count
// TRUSTED_PROXY_HOPS entries from the right (default 1: Hostinger's single proxy).
// Set TRUSTED_PROXY_HOPS=0 when the app is exposed directly with no proxy.
export function clientIp(req: Request) {
  const hops = Number(process.env.TRUSTED_PROXY_HOPS ?? 1);
  const realIp = req.headers.get('x-real-ip')?.trim();
  if (hops <= 0) return realIp || 'direct';
  const chain = (req.headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return chain[chain.length - hops] || realIp || 'unknown';
}
