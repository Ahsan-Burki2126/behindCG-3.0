-- Behind CG backend schema. Run once in Supabase → SQL Editor → New query → Run.

-- What each customer has bought or subscribed to. Written only by the Lemon Squeezy webhook
-- (app/api/webhooks/lemonsqueezy/route.ts) with the service-role key.
create table if not exists public.entitlements (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,               -- lower-case; matches the member's sign-in email
  key         text not null,               -- membership:basic | membership:pro | course:<slug> | addon:<slug>
  status      text not null,               -- Lemon Squeezy status: paid, refunded, active, on_trial, past_due, cancelled, expired …
  source_id   text not null unique,        -- order:<id>:<variant> or sub:<id>; makes webhook retries safe
  renews_at   timestamptz,
  ends_at     timestamptz,
  portal_url  text,                        -- Lemon Squeezy customer portal (manage card, cancel)
  customer_id text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists entitlements_email_idx on public.entitlements (email);

-- Row-level security on, with no policies: browsers can never read or write this table.
-- Only the website's server (service-role key) can.
alter table public.entitlements enable row level security;

-- Private storage for member downloads (scene files, project files).
insert into storage.buckets (id, name, public)
values ('member-files', 'member-files', false)
on conflict (id) do nothing;
