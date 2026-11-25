import type { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { authEnabled } from '@/lib/commerce/config';
import { SITE_URL } from '@/lib/site';
import { safeNext, supabaseServer } from '@/lib/supabase/server';

// The sign-in link lands here. Supports both Supabase link styles:
// ?code=… (default PKCE flow) and ?token_hash=…&type=magiclink (custom email template).
export async function GET(req: Request) {
  const url = new URL(req.url);
  // Behind Hostinger's proxy req.url can carry an internal host; use the real domain in production.
  const origin = process.env.NODE_ENV === 'production' ? SITE_URL : url.origin;
  const next = safeNext(url.searchParams.get('next'));
  const fail = NextResponse.redirect(new URL(`/sign-in?error=link&next=${encodeURIComponent(next)}`, origin));
  if (!authEnabled) return fail;

  const supabase = await supabaseServer();
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType | null;

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error('missing code') };

  if (error) return fail;
  return NextResponse.redirect(new URL(next, origin));
}
