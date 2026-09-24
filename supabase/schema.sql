create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  email text,
  school_id_number text,
  school_name text,
  id_photo_url text,
  verification_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  quantity integer not null default 1,
  notes text,
  file_url text,
  status text not null default 'pending',
  pickup_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pickups (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  verified_by text,
  verified_at timestamptz,
  student_school_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.pickups enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders"
  on public.orders
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own orders" on public.orders;
create policy "Users can update own orders"
  on public.orders
  for update
  using (auth.uid() = user_id);

drop policy if exists "Users can view own pickups" on public.pickups;
create policy "Users can view own pickups"
  on public.pickups
  for select
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  ));

drop policy if exists "Users can insert own pickups" on public.pickups;
create policy "Users can insert own pickups"
  on public.pickups
  for insert
  with check (exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  ));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_public_profiles_updated_at on public.profiles;
create trigger set_public_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_public_orders_updated_at on public.orders;
create trigger set_public_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Storage buckets must be created in the Supabase Storage dashboard, not via SQL.
-- Create these buckets manually in the UI:
-- 1) school_id_uploads
-- 2) order_files
--
-- Recommended bucket settings:
-- - Private buckets
-- - Authenticated users only
-- - Folder structure by user id: user_id/... 
--
-- Then add storage policies in the Supabase dashboard with rules like:
-- (bucket_id = 'school_id_uploads' AND auth.uid() = owner_id)
-- or a folder-based ownership check using the user folder name.
