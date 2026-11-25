import { NextResponse } from 'next/server';
import { authEnabled } from '@/lib/commerce/config';
import { fromThisSite } from '@/lib/http';
import { SITE_URL } from '@/lib/site';
import { supabaseServer } from '@/lib/supabase/server';

// Sign out (POST only, from this site's own form).
export async function POST(req: Request) {
  if (!fromThisSite(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (authEnabled) {
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
  }
  const origin = process.env.NODE_ENV === 'production' ? SITE_URL : new URL(req.url).origin;
  return NextResponse.redirect(new URL('/', origin), { status: 303 });
}
