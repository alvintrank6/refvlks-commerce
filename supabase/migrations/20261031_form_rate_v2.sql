alter table public.studio_visits add column if not exists ip_hash text;
alter table public.messages add column if not exists ip_hash text;
create index if not exists studio_visits_rate_idx on public.studio_visits (ip_hash, created_at);
create index if not exists messages_rate_idx on public.messages (ip_hash, created_at);
