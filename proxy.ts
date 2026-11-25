import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Keeps member sessions fresh and protects member-only routes. Runs only on the paths in
// `matcher`, so public pages stay static and fast. Does nothing until Supabase is configured.
export async function proxy(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (!data.user && (path.startsWith('/account') || path.startsWith('/learn'))) {
    const to = request.nextUrl.clone();
    to.pathname = '/sign-in';
    to.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(to);
  }
  return response;
}

export const config = {
  matcher: ['/account/:path*', '/learn/:path*', '/sign-in', '/auth/:path*', '/api/member/:path*'],
};
