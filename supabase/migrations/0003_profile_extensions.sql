-- Profile extensions for Club FLE: notification prefs + avatar storage
-- Run against a Supabase project with 0001 and 0002 migrations already applied.

-- ═══════════════════════════════════════════
-- NOTIFICATION PREFERENCES
-- ═══════════════════════════════════════════

alter table public.profiles
  add column if not exists notify_weekly_summary boolean not null default true,
  add column if not exists notify_budget_alerts   boolean not null default true,
  add column if not exists notify_goal_reminders  boolean not null default true;

-- ═══════════════════════════════════════════
-- AVATAR STORAGE
-- Files live at avatars/{user_id}/{filename}. Public read (avatars are
-- meant to be displayed anywhere), writes restricted to the owning folder.
-- ═══════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatar_public_read" on storage.objects;
create policy "avatar_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatar_insert_own" on storage.objects;
create policy "avatar_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatar_update_own" on storage.objects;
create policy "avatar_update_own" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatar_delete_own" on storage.objects;
create policy "avatar_delete_own" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
