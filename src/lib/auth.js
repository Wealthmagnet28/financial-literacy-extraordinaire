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
    .select('id, display_name, age_tier, avatar_url')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}
