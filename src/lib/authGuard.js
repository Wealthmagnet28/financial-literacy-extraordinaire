import { supabase } from './supabase';

// Client-side redirect guard for pages that require a signed-in user.
// Keeps `revealSelector` hidden (via inline visibility) until the session
// check resolves, then either reveals it or redirects to /login.
export async function requireAuth(revealSelector = '#protectedMain') {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const redirect = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    window.location.href = `/login?redirect=${redirect}`;
    return null;
  }

  const el = document.querySelector(revealSelector);
  if (el) el.style.visibility = 'visible';
  return session;
}
