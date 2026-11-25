# Adding your real content

Everything visible on the site comes from a few data files and folders. You never need to edit page code to replace placeholders.

Search the project for `[` to find every bracketed placeholder (prices, dates, names) and for `[confirm]` to find copy that needs your approval.

## 1. Site details: `lib/site.ts`

Domain fallback, emails (hello@, support@, privacy@), social links (`[handle]`), member login URL.

## 2. Content: data files

| What | File |
|---|---|
| Portfolio items, films, addons, free downloads, courses, blog cards, membership plans, **showreel** | `lib/catalog.ts` |
| The four service pages | `lib/services.ts` |
| Addon features, course curriculum, case study, film page | `lib/details.ts` |
| **Blog posts** (one Markdown file each; see `content/blog/README.md`) | `content/blog/*.md` |
| **What you sell:** checkout links, Lemon Squeezy variant IDs, member downloads | `lib/commerce/products.ts` |
| Course lesson videos (shown only to buyers and Pro members) | `lib/commerce/lessons.ts` |
| SEO titles and descriptions per page | `lib/seo.ts` |
| Detail-page list for the sitemap (keep in sync with catalog when you add or remove items; blog posts are added automatically) | `lib/content.ts` |
| FAQ answers | `app/faq/page.tsx` |
| Legal pages (have them reviewed) | `app/privacy`, `app/terms`, `app/licenses` |

Prices in `[brackets]` are hidden from Google's structured data automatically; once you write a real price like `$12`, it is published as an offer.

## 3. Images

Save JPGs in `public/images/` using the exact names listed in `public/images/README.md`. Each one replaces its shaded stand-in on the next build, with resizing, WebP, lazy loading and a blurred preview handled automatically.

- About 2400px on the long side (hero: 2400–2800px), quality 80–85.
- Update the `alt` text next to each item in the data files so it describes the real image.

## 4. 3D models (interactive viewer)

The case study page shows a **View in 3D** button when its model file exists. Nothing 3D downloads until a visitor clicks it, so models never slow the page.

1. In Blender: File → Export → glTF 2.0 → **glTF Binary (.glb)**, apply modifiers, +Y up. Bake procedural materials to textures first.
2. Save it as `models-src/<slug>.glb`, e.g. `models-src/plant-based-sleeping-mask.glb`.
3. Run `npm run models`. It compresses geometry (Draco), converts textures to WebP at 2048px max and writes `public/models/<slug>.glb`, warning if a model is over 6 MB.
4. Commit `public/models/` and deploy.

To add a viewer elsewhere, use `<Model3D model="/models/name.glb" src="/images/...jpg" alt="..." />` (see `components/Model3D.tsx`). On phones the viewer offers "View in your room" (AR).

Budget: aim for 2–6 MB per model. If one is bigger, reduce polygons (Decimate modifier) or texture resolution in Blender.

## 5. Videos

Films load nothing until the visitor presses play.

- **Showreel:** `SHOWREEL` in `lib/catalog.ts`.
- **Film page:** `video` in `FILM_DETAIL`, `lib/details.ts`.
- Values: `{ provider: 'youtube', id: 'dQw4w9WgXcQ' }`, `{ provider: 'vimeo', id: '123456789' }` or `{ provider: 'file', src: '/videos/reel.mp4' }`.

Prefer YouTube or Vimeo (they stream the right quality for each visitor). Self-hosted files: H.264 MP4, under ~40 MB, and set `NEXT_PUBLIC_MEDIA_HOST` if they live on another domain.

## 6. Downloads

Upload scene files to a file host (or a subdomain on Hostinger) and paste each link into `url` in `DOWNLOADS`, `lib/catalog.ts`. Empty links show a disabled "File coming soon" button.

## 7. Quote form

Set `QUOTE_WEBHOOK_URL` (see `docs/DEPLOY-HOSTINGER.md`). The webhook receives JSON with `name, email, company, services, details, budget, launch, files, consent, receivedAt, source`.

## 8. Test before you launch

```bash
npm run build
npm run start            # in one terminal
npm run test:e2e         # in another (BASE_URL defaults to http://localhost:3000)
```
