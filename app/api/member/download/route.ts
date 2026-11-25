import { NextResponse } from 'next/server';
import { canDownload } from '@/lib/commerce/access';
import { authEnabled, storeEnabled } from '@/lib/commerce/config';
import { MEMBER_FILES } from '@/lib/commerce/products';
import { entitlementsFor, signedDownloadUrl } from '@/lib/commerce/store';
import { currentUser } from '@/lib/supabase/server';

// Member download: checks the signed-in member's access, then redirects to a 60-second
// signed URL for the private file. Only files listed in MEMBER_FILES can be requested.
export async function GET(req: Request) {
  const noStore = { 'Cache-Control': 'no-store' };
  if (!authEnabled || !storeEnabled) return NextResponse.json({ error: 'Downloads are not available yet' }, { status: 503, headers: noStore });

  const id = new URL(req.url).searchParams.get('id') ?? '';
  const file = MEMBER_FILES.find((f) => f.id === id);
  if (!file) return NextResponse.json({ error: 'File not found' }, { status: 404, headers: noStore });

  const user = await currentUser();
  if (!user?.email) return NextResponse.json({ error: 'Sign in first' }, { status: 401, headers: noStore });
  if (!canDownload(await entitlementsFor(user.email), file)) {
    return NextResponse.json({ error: 'Your plan does not include this file' }, { status: 403, headers: noStore });
  }

  try {
    return NextResponse.redirect(await signedDownloadUrl(file.path, 60), { status: 302, headers: noStore });
  } catch (err) {
    console.error('Member download failed', err);
    return NextResponse.json({ error: 'File is not available right now' }, { status: 502, headers: noStore });
  }
}
