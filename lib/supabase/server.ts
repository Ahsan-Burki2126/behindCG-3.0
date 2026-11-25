import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { authEnabled, env } from '@/lib/commerce/config';

// Supabase client bound to the visitor's session cookies (sign-in state).
// Uses the public anon key; data access goes through lib/commerce/store.ts on the server.
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only. proxy.ts refreshes them.
        }
      },
    },
  });
}

/** The signed-in member, verified with Supabase (not just read from the cookie). */
export async function currentUser() {
  if (!authEnabled) return null;
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Only allow same-site relative redirects after sign-in (no open redirects). */
export function safeNext(next: string | null | undefined, fallback = '/account') {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return fallback;
  return next;
}
