-- Halı Saha Taktik — örnek şema (dökümandaki modele uygun)
-- Supabase SQL Editor’da çalıştırın; ardından RLS politikalarını ihtiyaca göre sıkılaştırın.

create extension if not exists "pgcrypto";

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.team_players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  name text not null,
  number int not null default 1,
  role text,
  color text
);

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  position text not null default '',
  preferred_foot text not null default '',
  dominant_roles jsonb not null default '[]'::jsonb,
  bio text not null default '',
  avatar_url text not null default '',
  phone text not null default '',
  social_link text not null default '',
  privacy_level text not null default 'friends',
  birth_date date,
  favorite_team text not null default '',
  city text not null default '',
  district text not null default '',
  height_cm int,
  weight_kg int,
  updated_at timestamptz not null default now()
);

alter table public.user_profiles add column if not exists position text not null default '';
alter table public.user_profiles add column if not exists preferred_foot text not null default '';
alter table public.user_profiles add column if not exists dominant_roles jsonb not null default '[]'::jsonb;
alter table public.user_profiles add column if not exists bio text not null default '';
alter table public.user_profiles add column if not exists avatar_url text not null default '';
alter table public.user_profiles add column if not exists phone text not null default '';
alter table public.user_profiles add column if not exists social_link text not null default '';
alter table public.user_profiles add column if not exists privacy_level text not null default 'friends';
alter table public.user_profiles add column if not exists birth_date date;

create table if not exists public.tactics (
  id uuid primary key,
  user_id uuid references auth.users (id) on delete set null,
  team_id uuid references public.teams (id) on delete set null,
  owner_name text not null default 'KadroKur kullanıcısı',
  title text not null default '',
  home_team_name text not null default '',
  away_team_name text not null default '',
  formation_key text not null,
  preset_key text,
  canvas_state jsonb not null,
  share_id text not null unique,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tactics add column if not exists home_team_name text not null default '';
alter table public.tactics add column if not exists away_team_name text not null default '';
alter table public.tactics add column if not exists owner_name text not null default 'KadroKur kullanıcısı';
alter table public.tactics add column if not exists updated_at timestamptz not null default now();

create index if not exists tactics_share_id_idx on public.tactics (share_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tactics_updated_at on public.tactics;
create trigger set_tactics_updated_at
before update on public.tactics
for each row
execute function public.set_updated_at();

alter table public.tactics enable row level security;
alter table public.user_profiles enable row level security;

drop policy if exists "public read tactics" on public.tactics;
drop policy if exists "anon insert tactics" on public.tactics;
drop policy if exists "anon update tactics" on public.tactics;
drop policy if exists "owner delete tactics" on public.tactics;
drop policy if exists "owner read profile" on public.user_profiles;
drop policy if exists "owner upsert profile" on public.user_profiles;
drop policy if exists "owner update profile" on public.user_profiles;

-- Herkes yalnızca public taktikleri okuyabilir
create policy "public read tactics"
  on public.tactics for select
  using (is_public = true);

-- Giriş yapan kullanıcı kendi taktiklerini okuyabilir
create policy "owner read tactics"
  on public.tactics for select
  using (auth.uid() = user_id);

-- Giriş yapan kullanıcı yalnızca kendisi için insert yapabilir
create policy "owner insert tactics"
  on public.tactics for insert
  with check (auth.uid() = user_id);

-- Giriş yapan kullanıcı yalnızca kendi satırlarını güncelleyebilir
create policy "owner update tactics"
  on public.tactics for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner delete tactics"
  on public.tactics for delete
  using (auth.uid() = user_id);

create policy "owner read profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "owner upsert profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "owner update profile"
  on public.user_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Yeni kullanıcı → user_profiles (tek doğruluk kaynağı; metadata ile hizalı)
-- Supabase Dashboard → SQL Editor’da çalıştırın. auth.users tetikleyicisi
-- projede yoksa `ensureUserProfileFromAuthUser` (OAuth callback + istemci) yedekler.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  fn text := '';
  ln text := '';
  bd date;
  av text := '';
  full_raw text;
begin
  fn := coalesce(nullif(trim(meta->>'first_name'), ''), nullif(trim(meta->>'given_name'), ''));
  ln := coalesce(nullif(trim(meta->>'last_name'), ''), nullif(trim(meta->>'family_name'), ''));

  if fn = '' and ln = '' then
    full_raw := coalesce(
      nullif(trim(meta->>'full_name'), ''),
      nullif(trim(meta->>'name'), ''),
      nullif(trim(meta->>'user_name'), '')
    );
    if full_raw <> '' then
      fn := split_part(full_raw, ' ', 1);
      ln := nullif(trim(substring(full_raw from length(split_part(full_raw, ' ', 1)) + 2)), '');
    end if;
  end if;

  begin
    bd := (nullif(trim(meta->>'birth_date'), ''))::date;
  exception when others then
    bd := null;
  end;

  av := coalesce(nullif(trim(meta->>'avatar_url'), ''), nullif(trim(meta->>'picture'), ''), '');

  insert into public.user_profiles (user_id, first_name, last_name, birth_date, avatar_url, updated_at)
  values (new.id, fn, ln, bd, av, now())
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
