-- Profiles table for Club FLE auth system
-- Run against a Supabase project with auth.users already present.

-- ═══════════════════════════════════════════
-- TABLE
-- ═══════════════════════════════════════════

create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  age_tier      text check (age_tier in ('kids', 'teens', 'young-adults', 'adults')),
  avatar_url    text,
  date_of_birth date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- ═══════════════════════════════════════════
-- KEEP updated_at FRESH
-- ═══════════════════════════════════════════

create or replace function public.set_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

-- ═══════════════════════════════════════════
-- AUTO-CREATE PROFILE ON SIGN-UP
-- Reads display_name / age_tier from the auth.users metadata passed at
-- signup time (supabase.auth.signUp({ options: { data: {...} } })).
-- ═══════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, age_tier)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'age_tier'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
