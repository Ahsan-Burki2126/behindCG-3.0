// Everything you sell, in one place. For each product, paste from Lemon Squeezy:
//   - checkoutUrl: Products → your product → Share → "Checkout link" (https://<store>.lemonsqueezy.com/buy/…)
//   - variantIds: the numeric ID of each variant (Products → variant → the number in its URL).
//     The webhook uses it to know what a customer bought.
// An empty checkoutUrl shows a disabled "opens soon" button instead of a broken link.
//
// Access rules (lib/commerce/access.ts):
//   membership:pro   → all courses + member files
//   membership:basic → member files
//   course:<slug>    → that course
//   addon:<slug>     → listed under "Your purchases" (Lemon Squeezy emails the file and licence key)

export type EntitlementKey = 'membership:basic' | 'membership:pro' | `course:${string}` | `addon:${string}`;

export type Product = {
  key: EntitlementKey;
  name: string;
  checkoutUrl: string;
  variantIds: number[];
  kind: 'subscription' | 'one-time';
};

export const PRODUCTS: Product[] = [
  { key: 'membership:basic', name: 'Basic membership', kind: 'subscription', checkoutUrl: '', variantIds: [] }, // [replace]
  { key: 'membership:pro', name: 'Pro membership', kind: 'subscription', checkoutUrl: '', variantIds: [] }, // [replace]
  { key: 'course:product-visualization-masterclass', name: 'Product Visualization Masterclass', kind: 'one-time', checkoutUrl: '', variantIds: [] }, // [replace]
  { key: 'addon:batch-render-pro', name: 'Batch Render Pro', kind: 'one-time', checkoutUrl: '', variantIds: [] }, // [replace]
  { key: 'addon:clay-render-pro', name: 'Clay Render Pro', kind: 'one-time', checkoutUrl: '', variantIds: [] },
  { key: 'addon:smart-texture-loader', name: 'Smart Texture Loader', kind: 'one-time', checkoutUrl: '', variantIds: [] },
  { key: 'addon:simple-texture-baker', name: 'Simple Texture Baker', kind: 'one-time', checkoutUrl: '', variantIds: [] },
  { key: 'addon:drive-it', name: 'Drive it', kind: 'one-time', checkoutUrl: '', variantIds: [] },
];

export const productByKey = (key: string) => PRODUCTS.find((p) => p.key === key);
// Variants can also be mapped without editing code, via an environment variable:
//   LEMONSQUEEZY_VARIANT_MAP={"123456":"membership:pro","123457":"course:product-visualization-masterclass"}
function envVariantMap(): Record<string, string> {
  try {
    return JSON.parse(process.env.LEMONSQUEEZY_VARIANT_MAP || '{}');
  } catch {
    return {};
  }
}
export const productByVariant = (variantId: number) => {
  const mapped = envVariantMap()[String(variantId)];
  return (mapped && productByKey(mapped)) || PRODUCTS.find((p) => p.variantIds.includes(variantId));
};

/** Checkout link with the buyer's email pre-filled when we know it, so access matches their account. */
export function checkoutLink(key: EntitlementKey, email?: string) {
  const p = productByKey(key);
  if (!p?.checkoutUrl) return '';
  if (!email) return p.checkoutUrl;
  const url = new URL(p.checkoutUrl);
  url.searchParams.set('checkout[email]', email);
  return url.toString();
}

// Files members can download (stored privately in Supabase Storage, bucket "member-files").
// `path` is the object path inside the bucket; `access` is who may download it.
export type MemberFile = { id: string; title: string; text: string; path: string; access: 'membership' | EntitlementKey; size: string };

export const MEMBER_FILES: MemberFile[] = [
  { id: 'studio-scene-2026-11', title: '[Month] studio scene', text: 'This month’s product studio scene with lighting and camera rig.', path: 'scenes/2026-11-studio.zip', access: 'membership', size: '[00] MB' }, // [replace]
  { id: 'masterclass-project-files', title: 'Masterclass project files', text: 'Every scene file used in the Product Visualization Masterclass.', path: 'courses/masterclass-project-files.zip', access: 'course:product-visualization-masterclass', size: '[00] MB' }, // [replace]
];
