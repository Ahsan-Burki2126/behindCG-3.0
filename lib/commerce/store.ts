import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Entitlement } from './access';
import { env, storeEnabled } from './config';

// Server-side database access with the service-role key. Never import this from a client
// component: the key bypasses row-level security. Schema: supabase/schema.sql.

let admin: SupabaseClient | null = null;
export function adminClient() {
  if (!storeEnabled) throw new Error('Supabase store is not configured');
  admin ??= createClient(env.supabaseUrl, env.supabaseServiceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return admin;
}

export type EntitlementWrite = {
  email: string;
  key: string;
  status: string;
  source_id: string; // "order:<id>:<variant>" or "sub:<id>"; unique, makes webhooks idempotent
  renews_at?: string | null;
  ends_at?: string | null;
  portal_url?: string | null;
  customer_id?: string | null;
};

export async function upsertEntitlement(e: EntitlementWrite) {
  const { error } = await adminClient()
    .from('entitlements')
    .upsert({ ...e, email: e.email.toLowerCase(), updated_at: new Date().toISOString() }, { onConflict: 'source_id' });
  if (error) throw new Error(`entitlements upsert failed: ${error.message}`);
}

export async function setStatusBySource(sourcePrefix: string, status: string) {
  const { error } = await adminClient()
    .from('entitlements')
    .update({ status, updated_at: new Date().toISOString() })
    .like('source_id', `${sourcePrefix}%`);
  if (error) throw new Error(`entitlements update failed: ${error.message}`);
}

export async function entitlementsFor(email: string): Promise<Entitlement[]> {
  if (!storeEnabled || !email) return [];
  const { data, error } = await adminClient()
    .from('entitlements')
    .select('key,status,renews_at,ends_at,portal_url,source_id,updated_at')
    .eq('email', email.toLowerCase())
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('entitlements read failed', error.message);
    return [];
  }
  return data ?? [];
}

/** Short-lived download link for a private member file. */
export async function signedDownloadUrl(path: string, seconds = 60) {
  const { data, error } = await adminClient().storage.from(env.memberBucket).createSignedUrl(path, seconds, { download: true });
  if (error || !data) throw new Error(`signed URL failed: ${error?.message ?? 'no data'}`);
  return data.signedUrl;
}
