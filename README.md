# Behind CG website

Next.js 16 site for Behind CG, a 3D product visualization studio: client work for brands, plus Blender addons, scene files, courses and membership for artists.

- **How payments, membership, accounts, courses, downloads and the blog work:** [docs/BACKEND.md](docs/BACKEND.md)
- **Deploy:** [docs/DEPLOY-HOSTINGER.md](docs/DEPLOY-HOSTINGER.md)
- **Replace placeholders with real content, images, 3D models and videos:** [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)
- **Design system:** [docs/DESIGN.md](docs/DESIGN.md) · **Product rules:** [docs/PRODUCT.md](docs/PRODUCT.md)

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (also copies the 3D decoder files)
npm run start        # serve the production build
npm run models       # compress Blender .glb exports from models-src/ into public/models/
npm run test:e2e     # 161 end-to-end checks against a running server (BASE_URL, default http://localhost:3000)
npm run test:backend # payments, sign-in, account, courses, downloads (starts its own server + mock Supabase)
npm run test:webhook # quote form delivery to a webhook (starts its own servers)
npm run test:3d      # 3D viewer (run `npm run test:sample-model` and rebuild first)
npm run typecheck
```

## What's inside

| Area | Where |
|---|---|
| Pages (32 routes, including detail pages, 404, thank-you) | `app/` |
| Shared UI: nav, footer, cards, hero visuals, gallery + lightbox, accordion, before/after slider | `components/` |
| GSAP motion (SplitText headlines, scroll reveals, sticky horizontal showcase, parallax, magnetic buttons, lazy-loaded) | `components/Motion.tsx` |
| Click-to-load 3D viewer (model-viewer, Draco, AR) | `components/Model3D.tsx`, `components/ModelViewer.tsx` |
| Click-to-play video (YouTube, Vimeo, self-hosted) | `components/VideoPlayer.tsx` |
| Image slots with automatic fallback, WebP, blur previews | `components/Render.tsx`, `public/images/README.md` |
| Content data | `lib/catalog.ts`, `lib/services.ts`, `lib/details.ts`, `lib/content.ts` |
| SEO: metadata, sitemap, robots, social images, JSON-LD | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `lib/og.tsx`, `lib/jsonld.ts` |
| Quote form + API (validation, honeypot, rate limit, webhook) | `components/QuoteForm.tsx`, `app/api/quote/route.ts` |
| Payments (Lemon Squeezy), membership, accounts (Supabase), courses, member downloads | `lib/commerce/`, `app/account`, `app/learn`, `app/sign-in`, `app/auth`, `app/api/webhooks`, `proxy.ts`, `supabase/schema.sql` |
| Blog (Markdown files) | `content/blog/`, `lib/blog.ts` |
| Security headers and CSP | `next.config.ts` |
| Analytics (optional, cookieless Umami or Plausible) | `components/Analytics.tsx` |
| End-to-end tests | `tests/e2e/` |

## Before launch

- Replace every `[bracketed]` placeholder and approve every `[confirm]` line (see the content guide).
- Real renders, films and models instead of stand-ins.
- Real testimonials and client logos only with permission; none are shipped as placeholders.
- Legal pages (`/privacy`, `/terms`, `/licenses`) are drafts: have them reviewed. If you sell digital products directly (not through a merchant of record such as Paddle or Lemon Squeezy), EU and UK consumer law expects a business address in the legal pages.
- Set `QUOTE_WEBHOOK_URL` so quote requests reach you.
- Connect Lemon Squeezy and Supabase to switch on payments and member accounts ([docs/BACKEND.md](docs/BACKEND.md)). Until then, buy buttons show "opens soon".
