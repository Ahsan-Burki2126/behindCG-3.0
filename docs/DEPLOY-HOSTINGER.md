# Deploying Behind CG on Hostinger

The site is a Next.js app. It needs a plan that runs **Node.js web apps** (Hostinger Business or Cloud web hosting, or a VPS). Single and Premium shared plans only serve static files and cannot run the quote form or the image optimizer.

## 1. Put the code on GitHub

1. Create a private GitHub repository and push this folder to it (`.gitignore` already excludes `node_modules`, `.next`, `.env*`, `models-src` and the generated decoders).
2. Add your real images, models and data first, or push now and update later: every push redeploys.

## 2. Create the Node.js app in hPanel

1. hPanel → **Websites** → **Add website** → **Node.js app** (the wording can differ by region; look for "Node.js" or "Web app").
2. Connect GitHub and choose the repository and the `main` branch.
3. Settings:
   - **Node.js version:** 20 or 22 (LTS).
   - **Install command:** `npm ci`
   - **Build command:** `npm run build` (this also copies the 3D decoder files)
   - **Start command:** `npm run start`
   - **Port:** Hostinger sets `PORT`; `next start` reads it automatically.
4. **Environment variables** (hPanel → your app → Environment variables). Copy them from `.env.example`:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://behindcg.com` (your real domain, no trailing slash) |
   | `QUOTE_WEBHOOK_URL` | Your n8n (or Make/Zapier) webhook URL that emails you the lead |
   | `QUOTE_WEBHOOK_SECRET` | Any long random string; check it in the webhook (`Authorization: Bearer …`) |
   | `NEXT_PUBLIC_ANALYTICS` / `_SRC` / `_ID` | Optional: Umami or Plausible (see `.env.example`) |
   | `NEXT_PUBLIC_NOINDEX` | `1` only on a staging copy |
   | `TRUSTED_PROXY_HOPS` | `1` (Hostinger's proxy) |
   | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Member accounts and purchases ([docs/BACKEND.md](BACKEND.md)) |
   | `LEMONSQUEEZY_WEBHOOK_SECRET`, `LEMONSQUEEZY_VARIANT_MAP` | Payments ([docs/BACKEND.md](BACKEND.md)) |

   Environment variables are read when the app is built: after adding or changing any of them, **redeploy** (the security policy that allows your analytics or media host is built in at that moment too).

5. Deploy. The first build takes a few minutes.

## 3. Domain and HTTPS

1. Point the domain at the app in hPanel (Domains → connect to the website).
2. Turn on the free SSL certificate and **force HTTPS**. The site sends an HSTS header, so HTTPS must work before you go live on the main domain.

## 4. Check after the first deploy

- Open the site, submit a test quote: it must land on the thank-you page and reach your webhook. If it shows "did not send", `QUOTE_WEBHOOK_URL` is missing or the webhook returned an error.
- `https://your-domain/robots.txt` and `/sitemap.xml` show your domain, not behindcg.com.
- Submit the sitemap in Google Search Console.
- Share a page link in WhatsApp or LinkedIn to check the social preview image.

## 5. Updating content

Edit the data files, add images or models (see `docs/CONTENT-GUIDE.md`), commit and push. Hostinger rebuilds automatically. Image and model files are checked **at build time**, so a new file appears after the next deploy.

## Notes for this host

- **CDN / cache:** if Hostinger's CDN or LiteSpeed cache is enabled for the domain, purge it after every deploy. Pages are cached for a long time, and an old cached page can point to files from the previous build.

- **Quote rate limiting** is kept in memory, which is right for Hostinger's single Node process. If you ever run several instances, move it to Redis.
- **Visitor IP for rate limiting** comes from `x-forwarded-for`, set by Hostinger's proxy. On a VPS, put Nginx in front and set `proxy_set_header X-Forwarded-For $remote_addr;` (overwrite, not append) so visitors can't spoof it.
- **Image optimization** runs on the server with `sharp` and caches results in `.next/cache/images` for 30 days. Keep source images around 2400px wide; very large originals cost CPU on the first request.
- **Videos** should be hosted on YouTube, Vimeo or a video CDN (Bunny Stream, Cloudflare Stream), not uploaded into the app. Large downloads (scene files) belong on a file host or a subdomain; paste the link into `lib/catalog.ts`.

## VPS alternative

On a Hostinger VPS: install Node 22, clone the repo, `npm ci && npm run build`, run with PM2 (`pm2 start npm --name behindcg -- start`), put Nginx in front as a reverse proxy with HTTPS (Certbot), and set the environment variables in an `.env.production` file or the PM2 ecosystem file.
