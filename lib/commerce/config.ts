import 'server-only';

// Backend switches. Each feature turns on when its keys are set (hPanel → Environment
// variables, or .env.local). Without keys the site still works: buttons show "opens soon"
// and member pages explain that accounts are not live yet.
export const env = {
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  lemonWebhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? '',
  memberBucket: process.env.SUPABASE_MEMBER_BUCKET ?? 'member-files',
};

/** Members can sign in (Supabase Auth). */
export const authEnabled = Boolean(env.supabaseUrl && env.supabaseAnonKey);
/** Purchases can be recorded and checked (Supabase database, server-side key). */
export const storeEnabled = Boolean(env.supabaseUrl && env.supabaseServiceKey);
/** Lemon Squeezy webhooks can be verified. */
export const webhookEnabled = Boolean(env.lemonWebhookSecret);
