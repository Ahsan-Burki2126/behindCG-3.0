import type { EntitlementKey, MemberFile } from './products';

// Pure access rules (no I/O), shared by pages and API routes, and covered by tests.

export type Entitlement = {
  key: string;
  status: string; // Lemon Squeezy status: paid, refunded, on_trial, active, paused, past_due, unpaid, cancelled, expired
  renews_at: string | null;
  ends_at: string | null;
  portal_url: string | null;
  source_id: string;
  updated_at?: string;
};

const ACTIVE = new Set(['paid', 'active', 'on_trial', 'past_due']);

/** Does this single record currently grant access? */
export function isLive(e: Entitlement, now = new Date()) {
  if (ACTIVE.has(e.status)) return true;
  // A cancelled subscription keeps access until the end of the paid period.
  if (e.status === 'cancelled' && e.ends_at) return new Date(e.ends_at) > now;
  return false;
}

export function liveKeys(list: Entitlement[], now = new Date()) {
  return new Set(list.filter((e) => isLive(e, now)).map((e) => e.key));
}

export function membershipTier(list: Entitlement[], now = new Date()): 'pro' | 'basic' | null {
  const keys = liveKeys(list, now);
  if (keys.has('membership:pro')) return 'pro';
  if (keys.has('membership:basic')) return 'basic';
  return null;
}

/** Course access: bought the course, or Pro membership. */
export function canAccessCourse(list: Entitlement[], slug: string, now = new Date()) {
  const keys = liveKeys(list, now);
  return keys.has(`course:${slug}`) || keys.has('membership:pro');
}

export function canDownload(list: Entitlement[], file: MemberFile, now = new Date()) {
  const keys = liveKeys(list, now);
  if (file.access === 'membership') return keys.has('membership:basic') || keys.has('membership:pro');
  if (file.access.startsWith('course:')) return canAccessCourse(list, file.access.slice('course:'.length), now);
  return keys.has(file.access as EntitlementKey);
}

/** Map a Lemon Squeezy status to what we store. Orders: paid/refunded/pending/failed. */
export function normalizeStatus(status: unknown) {
  const s = String(status ?? '').toLowerCase();
  return s || 'unknown';
}
