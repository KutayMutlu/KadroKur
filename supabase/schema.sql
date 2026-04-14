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

create table if not exists public.tactics (
  id uuid primary key,
  user_id uuid references auth.users (id) on delete set null,
  team_id uuid references public.teams (id) on delete set null,
  title text not null default '',
  formation_key text not null,
  preset_key text,
  canvas_state jsonb not null,
  share_id text not null unique,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tactics_share_id_idx on public.tactics (share_id);

alter table public.tactics enable row level security;

drop policy if exists "public read tactics" on public.tactics;
drop policy if exists "anon insert tactics" on public.tactics;
drop policy if exists "anon update tactics" on public.tactics;

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
