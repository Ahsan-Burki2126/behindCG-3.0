'use server';

import { headers } from 'next/headers';
import { authEnabled } from '@/lib/commerce/config';
import { cleanLine } from '@/lib/http';
import { rateLimit } from '@/lib/rate-limit';
import { SITE_URL } from '@/lib/site';
import { safeNext, supabaseServer } from '@/lib/supabase/server';

export type SignInState = { status: 'idle' | 'sent' | 'error'; message?: string; email?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEN_MIN = 10 * 60 * 1000;

function ipFrom(h: Headers) {
  const hops = Number(process.env.TRUSTED_PROXY_HOPS ?? 1);
  const chain = (h.get('x-forwarded-for') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return (hops > 0 && chain[chain.length - hops]) || h.get('x-real-ip') || 'unknown';
}

// Sends a one-time sign-in link. Always answers the same way whether or not the email has
// an account, so the form can't be used to find out who is a member.
export async function sendMagicLink(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (!authEnabled) return { status: 'error', message: 'Member sign-in is not open yet.' };

  const email = cleanLine(formData.get('email'), 320).toLowerCase();
  if (!EMAIL.test(email)) return { status: 'error', message: 'Enter your email address in the format name@example.com.' };

  const h = await headers();
  const byIp = rateLimit(`signin-ip:${ipFrom(h)}`, 8, TEN_MIN);
  const byEmail = rateLimit(`signin-email:${email}`, 3, TEN_MIN);
  if (!byIp.ok || !byEmail.ok) {
    return { status: 'error', message: 'Too many sign-in attempts. Wait a few minutes, then try again.' };
  }

  const next = safeNext(String(formData.get('next') ?? ''));
  // In development the link points back to localhost; in production always to the real domain.
  const origin = process.env.NODE_ENV === 'production' ? SITE_URL : h.get('origin') ?? SITE_URL;
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`, shouldCreateUser: true },
  });
  if (error) console.error('Sign-in link failed:', error.message);
  return { status: 'sent', email };
}
