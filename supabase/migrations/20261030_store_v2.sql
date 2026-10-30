-- Optional Supabase adapter for the local-first Refvlks storefront.
-- Apply this and 20261030_donation_v2.sql, then run seed.sql.
create table if not exists public.products (
  handle text primary key,
  status text not null check (status in ('active', 'hidden')),
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory (
  sku text primary key,
  product_handle text not null references public.products(handle),
  price_vnd integer not null check (price_vnd >= 0),
  stock integer not null check (stock >= 0),
  name_en text not null,
  name_vi text not null,
  colour_en text not null,
  colour_vi text not null
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  number text not null unique,
  created_at timestamptz not null default now(),
  locale text not null check (locale in ('en', 'vi')),
  status text not null check (status in ('pending_confirmation', 'pending_payment', 'paid', 'cancelled')),
  payment_method text not null check (payment_method in ('cod', 'transfer')),
  delivery text not null check (delivery in ('ship', 'pickup')),
  customer_name text not null,
  phone text not null,
  email text,
  address text,
  city text not null check (city in ('hanoi', 'other')),
  subtotal integer not null,
  shipping_fee integer not null,
  total integer not null,
  customer_marked_paid_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  sku text not null references public.inventory(sku),
  name text not null,
  colour text not null,
  qty integer not null check (qty > 0),
  unit_price integer not null
);

create table if not exists public.studio_visits (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  visit_date date not null,
  visit_time time not null,
  bag text,
  note text,
  locale text not null check (locale in ('en', 'vi')),
  status text not null default 'requested',
  unique (visit_date, visit_time)
);

create table if not exists public.messages (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  topic text not null,
  order_number text,
  body text not null,
  locale text not null check (locale in ('en', 'vi')),
  status text not null default 'new'
);

alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.studio_visits enable row level security;
alter table public.messages enable row level security;

-- The adapter uses only the service role. Public clients never read customer records.
create policy "Public reads active products" on public.products
  for select to anon, authenticated using (status = 'active');

create or replace function public.create_order(p_customer jsonb, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item jsonb;
  v_variant public.inventory%rowtype;
  v_order_id uuid := gen_random_uuid();
  v_token text := encode(gen_random_bytes(32), 'hex');
  v_number text := 'RV' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS') || lpad((floor(random() * 1000)::int)::text, 3, '0');
  v_subtotal integer := 0;
  v_shipping integer;
  v_qty integer;
  v_count integer := 0;
  v_locale text := p_customer->>'locale';
  v_delivery text := p_customer->>'delivery';
  v_city text := p_customer->>'city';
  v_payment text := p_customer->>'payment';
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1
     or jsonb_array_length(p_items) > 10 then
    raise exception 'INVALID_CART';
  end if;
  if v_locale not in ('en','vi') or v_delivery not in ('ship','pickup')
     or v_city not in ('hanoi','other') or v_payment not in ('cod','transfer')
     or length(trim(coalesce(p_customer->>'name',''))) < 2
     or coalesce(p_customer->>'phone','') !~ '^0[0-9]{9}$'
     or (v_delivery = 'ship' and length(trim(coalesce(p_customer->>'address',''))) < 5)
  then
    raise exception 'INVALID_ORDER';
  end if;

  -- Lock inventory rows while pricing and reserving each item. A failed item
  -- aborts the entire function, including any earlier stock updates.
  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'qty')::integer;
    if v_qty < 1 or v_qty > 10 then raise exception 'INVALID_CART'; end if;
    select * into v_variant from public.inventory
      where sku = v_item->>'sku' for update;
    if not found or v_variant.stock < v_qty then raise exception 'OUT_OF_STOCK'; end if;
    update public.inventory set stock = stock - v_qty where sku = v_variant.sku;
    v_subtotal := v_subtotal + v_variant.price_vnd * v_qty;
    v_count := v_count + v_qty;
  end loop;
  if v_payment = 'cod' and v_count > 2 then raise exception 'COD_LIMIT'; end if;
  v_shipping := case when v_delivery = 'pickup' then 0 when v_city = 'hanoi' then 30000 else 40000 end;

  insert into public.orders (id, token, number, locale, status, payment_method, delivery,
    customer_name, phone, email, address, city, subtotal, shipping_fee, total)
  values (v_order_id, v_token, v_number, v_locale,
    case when v_payment = 'cod' then 'pending_confirmation' else 'pending_payment' end,
    v_payment, v_delivery, p_customer->>'name', p_customer->>'phone',
    nullif(p_customer->>'email',''), nullif(p_customer->>'address',''), v_city,
    v_subtotal, v_shipping, v_subtotal + v_shipping);

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select * into v_variant from public.inventory where sku = v_item->>'sku';
    insert into public.order_items (order_id, sku, name, colour, qty, unit_price)
    values (v_order_id, v_variant.sku,
      case when v_locale = 'vi' then v_variant.name_vi else v_variant.name_en end,
      case when v_locale = 'vi' then v_variant.colour_vi else v_variant.colour_en end,
      (v_item->>'qty')::integer, v_variant.price_vnd);
  end loop;
  return jsonb_build_object('token', v_token, 'number', v_number,
    'subtotal', v_subtotal, 'shipping', v_shipping, 'total', v_subtotal + v_shipping);
end;
$$;

revoke all on function public.create_order(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_order(jsonb, jsonb) to service_role;
