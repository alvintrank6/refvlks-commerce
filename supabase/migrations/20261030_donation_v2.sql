create table if not exists public.donation_events (
  id uuid primary key default gen_random_uuid(),
  date date,
  collection_window_en text,
  collection_window_vi text,
  destination_en text,
  destination_vi text,
  status text not null default 'announcing',
  kg_collected integer,
  pieces_delivered integer,
  kg_recycled integer,
  created_at timestamptz not null default now()
);

create table if not exists public.donation_signups (
  id uuid primary key,
  name text not null,
  phone text not null,
  email text,
  role text not null check (role in ('donate','volunteer','both')),
  amount text check (amount is null or amount in ('one','two-three','more')),
  note text,
  consent_privacy boolean not null,
  consent_recycle boolean not null,
  locale text not null check (locale in ('en','vi')),
  event_id uuid references public.donation_events(id),
  status text not null default 'new',
  created_at timestamptz not null default now(),
  ip_hash text,
  constraint donor_recycle_consent check (role = 'volunteer' or consent_recycle)
);

create index if not exists donation_signups_rate_limit_idx
  on public.donation_signups (ip_hash, created_at);

alter table public.donation_events enable row level security;
alter table public.donation_signups enable row level security;

-- Public visitors can read the event schedule. The service role writes signups.
create policy "Public reads donation events" on public.donation_events
  for select to anon, authenticated using (true);
