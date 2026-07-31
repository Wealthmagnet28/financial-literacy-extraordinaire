import { supabase } from './supabase';

export async function signUp({ email, password, displayName, ageTier }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, age_tier: ageTier },
    },
  });
}

export async function signIn({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function sendPasswordReset(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function updatePassword(password) {
  return supabase.auth.updateUser({ password });
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, display_name, age_tier, avatar_url, date_of_birth, notify_weekly_summary, notify_budget_alerts, notify_goal_reminders'
    )
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(userId, fields) {
  return supabase.from('profiles').update(fields).eq('id', userId);
}

export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });

  if (uploadError) return { url: null, error: uploadError };

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
