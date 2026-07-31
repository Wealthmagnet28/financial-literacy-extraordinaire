import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getProfile, signOut } from '../lib/auth';
import { colors } from './authStyles';

const AGE_TIER_LABELS = {
  kids: 'Kids',
  teens: 'Teens',
  'young-adults': 'Young Adult',
  adults: 'Adult',
};

const navBtnStyle = {
  background: `linear-gradient(135deg, ${colors.purple}, ${colors.orange})`,
  color: '#fff',
  padding: '10px 24px',
  borderRadius: '10px',
  fontWeight: 700,
  fontSize: '0.9rem',
  boxShadow: '0 0 18px rgba(123,47,242,0.3)',
  textDecoration: 'none',
};

const loginLinkStyle = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '0.9rem',
  fontWeight: 500,
  textDecoration: 'none',
};

export default function ProfileMenu() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadSession = async (sess) => {
      if (!mounted) return;
      setSession(sess);
      if (sess) {
        const p = await getProfile(sess.user.id);
        if (mounted) setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => loadSession(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      loadSession(sess);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (loading) return null;

  if (!session) {
    return (
      <>
        <a href="/login" style={loginLinkStyle}>Log In</a>
        <a href="/signup" style={navBtnStyle}>Sign Up</a>
      </>
    );
  }

  const name = profile?.display_name || session.user.email;
  const initials = name.trim().slice(0, 1).toUpperCase();
  const tierLabel = profile?.age_tier ? AGE_TIER_LABELS[profile.age_tier] : null;

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '0.95rem',
          color: '#fff',
          background: profile?.avatar_url
            ? `url(${profile.avatar_url}) center/cover`
            : `linear-gradient(135deg, ${colors.purple}, ${colors.orange})`,
        }}
      >
        {!profile?.avatar_url && initials}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            minWidth: '220px',
            borderRadius: '14px',
            border: '1px solid rgba(168,130,255,0.2)',
            background: 'linear-gradient(135deg, rgba(18,10,35,0.98), rgba(30,15,55,0.96))',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
            padding: '16px',
            zIndex: 300,
          }}
        >
          <p style={{ color: '#f0e8ff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>
            {profile?.display_name || 'Member'}
          </p>
          <p style={{ color: 'rgba(200,190,220,0.6)', fontSize: '0.75rem', marginBottom: tierLabel ? '8px' : '14px' }}>
            {session.user.email}
          </p>
          {tierLabel && (
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: colors.cyan,
                background: 'rgba(79,209,232,0.1)',
                border: '1px solid rgba(79,209,232,0.25)',
                borderRadius: '999px',
                padding: '3px 10px',
                marginBottom: '14px',
              }}
            >
              {tierLabel}
            </span>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <a
              href="/profile"
              style={{
                padding: '8px 4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
              }}
            >
              Profile
            </a>
            <a
              href="/settings"
              style={{
                padding: '8px 4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
              }}
            >
              Settings
            </a>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '9px',
              borderRadius: '9px',
              border: '1px solid rgba(255,107,107,0.25)',
              background: 'rgba(255,107,107,0.08)',
              color: '#ff6b6b',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
