import { NextResponse } from 'next/server';
import { env, storeEnabled, webhookEnabled } from '@/lib/commerce/config';
import { toAction, verifySignature } from '@/lib/commerce/lemonsqueezy';
import { setStatusBySource, upsertEntitlement } from '@/lib/commerce/store';
import { readCapped } from '@/lib/http';

// Lemon Squeezy → Settings → Webhooks → URL: https://<your-domain>/api/webhooks/lemonsqueezy
// Events: order_created, order_refunded, subscription_created, subscription_updated,
// subscription_cancelled, subscription_resumed, subscription_expired, subscription_paused,
// subscription_unpaused. Signing secret = LEMONSQUEEZY_WEBHOOK_SECRET.
export async function POST(req: Request) {
  if (!webhookEnabled || !storeEnabled) {
    // 503 makes Lemon Squeezy retry later instead of losing the event.
    return NextResponse.json({ error: 'Payments backend not configured' }, { status: 503 });
  }

  let raw: string;
  try {
    raw = await readCapped(req, 512 * 1024);
  } catch {
    return NextResponse.json({ error: 'Too large' }, { status: 413 });
  }
  if (!verifySignature(raw, req.headers.get('x-signature'), env.lemonWebhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const action = toAction(payload as Parameters<typeof toAction>[0]);
  try {
    if (action.type === 'upsert') await upsertEntitlement(action.write);
    if (action.type === 'status') await setStatusBySource(action.sourcePrefix, action.status);
  } catch (err) {
    console.error('Lemon Squeezy webhook failed', err);
    return NextResponse.json({ error: 'Could not record event' }, { status: 500 });
  }

  if (action.type === 'ignore') console.info('Lemon Squeezy webhook ignored:', action.reason);
  return NextResponse.json({ ok: true, action: action.type });
}
