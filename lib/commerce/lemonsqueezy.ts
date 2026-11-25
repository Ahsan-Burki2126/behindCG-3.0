import { createHmac, timingSafeEqual } from 'node:crypto';
import { normalizeStatus } from './access';
import { productByVariant } from './products';

// Lemon Squeezy webhook helpers (pure, unit-tested in tests/unit).

/** Lemon Squeezy signs the raw body with HMAC-SHA256 (hex) in the X-Signature header. */
export function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature || !secret) return false;
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature.trim(), 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

export type WebhookAction =
  | { type: 'upsert'; write: { email: string; key: string; status: string; source_id: string; renews_at: string | null; ends_at: string | null; portal_url: string | null; customer_id: string | null } }
  | { type: 'status'; sourcePrefix: string; status: string }
  | { type: 'ignore'; reason: string };

type Payload = {
  meta?: { event_name?: string };
  data?: { id?: string | number; attributes?: Record<string, unknown> };
};

/** Translate one webhook into a database action. */
export function toAction(payload: Payload): WebhookAction {
  const event = payload.meta?.event_name ?? '';
  const id = String(payload.data?.id ?? '');
  const a = payload.data?.attributes ?? {};
  const email = String(a.user_email ?? '').trim().toLowerCase();
  const customer = a.customer_id != null ? String(a.customer_id) : null;

  if (event === 'order_created') {
    const item = (a.first_order_item ?? {}) as { variant_id?: number };
    const product = productByVariant(Number(item.variant_id));
    if (!product) return { type: 'ignore', reason: `unknown variant ${item.variant_id}` };
    if (product.kind === 'subscription') return { type: 'ignore', reason: 'subscription order: handled by subscription events' };
    if (!email) return { type: 'ignore', reason: 'no email' };
    return {
      type: 'upsert',
      write: { email, key: product.key, status: normalizeStatus(a.status), source_id: `order:${id}:${item.variant_id}`, renews_at: null, ends_at: null, portal_url: null, customer_id: customer },
    };
  }

  if (event === 'order_refunded') {
    return { type: 'status', sourcePrefix: `order:${id}:`, status: 'refunded' };
  }

  if (event.startsWith('subscription_')) {
    if (event === 'subscription_payment_success' || event === 'subscription_payment_failed' || event === 'subscription_payment_recovered') {
      // Payment events carry the invoice, not the subscription; the subscription_updated event that follows has the new status.
      return { type: 'ignore', reason: `${event}: waiting for subscription_updated` };
    }
    const product = productByVariant(Number(a.variant_id));
    if (!product) return { type: 'ignore', reason: `unknown variant ${a.variant_id}` };
    if (!email) return { type: 'ignore', reason: 'no email' };
    const urls = (a.urls ?? {}) as { customer_portal?: string };
    return {
      type: 'upsert',
      write: {
        email,
        key: product.key,
        status: normalizeStatus(a.status),
        source_id: `sub:${id}`,
        renews_at: (a.renews_at as string) ?? null,
        ends_at: (a.ends_at as string) ?? null,
        portal_url: urls.customer_portal ?? null,
        customer_id: customer,
      },
    };
  }

  return { type: 'ignore', reason: `unhandled event ${event || '(none)'}` };
}
