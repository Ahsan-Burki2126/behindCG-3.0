# How the backend works

This explains, in plain language, how payments, membership, member accounts, courses, downloads, the blog and the quote form work behind the scenes, what you need to sign up for, and how to switch each part on. Everything is already built and tested; each part turns on when you add its keys.

## The big picture

The website does not store card details or handle tax. Two services do the heavy lifting, and the site connects them:

| Job | Service | Why this one |
|---|---|---|
| Taking payments (addons, courses, memberships) | **Lemon Squeezy** | It is the *merchant of record*: it is legally the seller, so it charges and pays VAT/sales tax in every country, handles cards, PayPal and Apple Pay, sends receipts, delivers files and **licence keys** for your addons, runs subscriptions and gives customers a billing portal. You get paid out. You never touch tax filings or card data. |
| Member sign-in and the purchase database | **Supabase** | Free tier is enough to start. Email sign-in links (no passwords to leak), a Postgres database, and private file storage for member downloads. |
| Quote requests | **Your n8n webhook** | Each quote request is posted to it; n8n emails you and can add the lead to a CRM. |
| The blog | **Markdown files in this project** | No CMS to pay for or keep updated. Write a file, push, it's published. |

```
 Visitor ──buys──▶ Lemon Squeezy checkout ──pays──▶ you
                         │
                         │ webhook (signed)
                         ▼
                 /api/webhooks/lemonsqueezy ──writes──▶ Supabase "entitlements" table
                                                              ▲
 Member ──signs in by email link──▶ /account, /learn ──reads──┘
                                    downloads ──▶ 60-second private link from Supabase Storage
```

## What happens in each situation

**Someone buys an addon**
1. They click **Buy** on the addon page and go to Lemon Squeezy's checkout.
2. Lemon Squeezy takes payment, emails the receipt, the download and a **licence key**.
3. The webhook records the purchase, so it also shows in their account under "Addon purchases".
4. Refunds you issue in Lemon Squeezy are recorded automatically.

**Someone joins Basic or Pro membership**
1. **Join** on `/membership` opens the subscription checkout.
2. After paying they land on `/welcome`, which tells them to sign in with the same email.
3. The webhook records the subscription with its renewal date and their billing-portal link.
4. On `/account` they see their plan, renewal date, member downloads and a **Manage billing** button (change card, cancel) that opens Lemon Squeezy's customer portal.
5. Monthly renewals, failed payments, cancellations and expiry all update automatically. A cancelled member keeps access until the end of the period they paid for, then loses it.

**Someone buys a course**
1. **Enrol now** on the course page opens checkout.
2. The webhook records it. On `/account` they get **Open course**, which leads to `/learn/<course>`: the lessons, each with its video.
3. Pro members get every course without buying it separately.
4. Lesson video IDs are only sent to people with access. Use Vimeo or Bunny Stream with domain-level privacy so the videos can't be embedded elsewhere.

**A member downloads a file**
Files sit in a **private** Supabase Storage bucket. When a member clicks Download, the site checks their access, then creates a link that works for 60 seconds. Links can't be shared or guessed.

**Signing in**
Members type their email on `/sign-in` and get a one-time link (no passwords). Access is tied to the email they used at checkout. The form is rate-limited and answers the same way for every email, so nobody can probe who is a member.

**Writing a blog post**
Add `content/blog/my-post.md` (see `content/blog/README.md`), push, and Hostinger rebuilds. The post gets its page, listing card, social image, sitemap entry and Google structured data automatically.

**A brand asks for a quote**
The form validates input, blocks bots (hidden honeypot field) and floods (rate limits), then posts the lead to your n8n webhook with a shared secret. If the webhook fails, the visitor is told and their typing is kept.

## Setting it up (about an hour)

### 1. Supabase (accounts + database)
1. Create a free project at supabase.com. Pick the region closest to most customers.
2. **SQL Editor → New query:** paste all of `supabase/schema.sql`, run it. This creates the purchases table (locked down so browsers can't read it) and the private `member-files` bucket.
3. **Authentication → URL Configuration:** Site URL = `https://behindcg.com`; add `https://behindcg.com/auth/callback` to Redirect URLs (and `http://localhost:3000/auth/callback` for testing).
4. **Authentication → Emails:** brand the "Magic link" email ("Your Behind CG sign-in link"). For reliable delivery, connect your own email sender under SMTP settings (Resend, Postmark or Brevo; Supabase's built-in sender is rate-limited and meant for testing).
5. **Project Settings → API:** copy the URL, the `anon` key and the `service_role` key into the environment variables below. The service-role key is secret: only put it in hPanel, never in code.
6. **Storage → member-files:** upload your scene files, matching the `path` values in `MEMBER_FILES` (`lib/commerce/products.ts`).

### 2. Lemon Squeezy (payments)
1. Create a store at lemonsqueezy.com and complete identity verification and payout details. (Check that payouts are supported for your country; they use bank transfer or PayPal.)
2. Create products:
   - Each addon: a one-time product with your .zip as the file and **licence keys** turned on.
   - The course: a one-time product.
   - Basic and Pro membership: subscription products (monthly, and yearly variants if you like).
3. For each product: Share → copy the **checkout link** into `checkoutUrl` in `lib/commerce/products.ts`, and note each **variant ID**. Put the variant IDs in `variantIds`, or set them without code in `LEMONSQUEEZY_VARIANT_MAP`.
4. Each product → Confirmation → **redirect after purchase:** `https://behindcg.com/welcome`.
5. **Settings → Webhooks → +:** URL `https://behindcg.com/api/webhooks/lemonsqueezy`, a long random signing secret (put the same value in `LEMONSQUEEZY_WEBHOOK_SECRET`), and tick: `order_created`, `order_refunded`, `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_resumed`, `subscription_expired`, `subscription_paused`, `subscription_unpaused`.
6. Use **test mode** first: buy with a test card, check that `/account` shows it, then switch to live mode and repeat the webhook setup for live.

If you keep selling an addon on Superhive too, leave its `checkoutUrl` empty and put the Superhive link in `buyUrl` (`lib/details.ts`); the Buy button uses it.

### 3. Environment variables (hPanel → Node.js app → Environment variables)

| Variable | From |
|---|---|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key (**secret**) |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | The signing secret you typed in Lemon Squeezy's webhook |
| `LEMONSQUEEZY_VARIANT_MAP` | Optional, e.g. `{"123456":"membership:pro","123457":"membership:basic"}` |
| `QUOTE_WEBHOOK_URL`, `QUOTE_WEBHOOK_SECRET` | Your n8n webhook |

Redeploy after changing them.

### 4. Check it works
- Lemon Squeezy test purchase → `/welcome` → sign in with that email → `/account` shows it.
- Membership test → download a member file → Manage billing opens the portal → cancel → access stays until the end date.
- Lemon Squeezy → Webhooks shows each delivery with a 200 response. A 503 means a key is missing; a 401 means the signing secret doesn't match.

## Costs (check current pricing)
- **Lemon Squeezy:** no monthly fee; a percentage plus a fixed amount per sale (about 5% + 50¢ at the time of writing). It covers tax handling and payment fees.
- **Supabase:** free tier (50,000 monthly active users, 1 GB storage); Pro is about $25/month when you outgrow it.
- **Email sender** for sign-in links: Resend, Postmark and Brevo all have free tiers that cover a small membership.
- **Hostinger:** your existing plan (needs Node.js support).

## Where the code lives

| Part | Files |
|---|---|
| Products, prices, member files, access rules | `lib/commerce/products.ts`, `lib/commerce/access.ts` |
| Webhook (signature check, events → database) | `app/api/webhooks/lemonsqueezy/route.ts`, `lib/commerce/lemonsqueezy.ts` |
| Database access (server only) | `lib/commerce/store.ts`, `supabase/schema.sql` |
| Sign-in, sessions, sign-out | `app/sign-in/`, `app/auth/`, `lib/supabase/server.ts`, `proxy.ts` |
| Member area, courses, downloads | `app/account/`, `app/learn/[slug]/`, `lib/commerce/lessons.ts`, `app/api/member/download/` |
| Blog | `content/blog/*.md`, `lib/blog.ts` |
| Quote form | `components/QuoteForm.tsx`, `app/api/quote/route.ts`, `lib/http.ts`, `lib/rate-limit.ts` |

## Tests
`npm run test:backend` runs the whole flow against a mock Supabase: signed webhooks (bad signature, oversize, idempotent retries, refunds, unknown products), sign-in links and rate limits, protected routes, the member account, course access, signed downloads, and cancellation before and after the paid period. All 23 checks pass.

## Later, if you need it
- **Free and discounted pricing for members:** Lemon Squeezy discount codes, shown on `/account` for members.
- **Licence check inside your Blender addons:** Lemon Squeezy has a licence API (`/v1/licenses/validate`) your addon can call.
- **Comments or community:** Discord or Circle linked from the account page is simpler than building one.
- **Several server instances:** move the in-memory rate limiter to Redis (Upstash has a free tier).
