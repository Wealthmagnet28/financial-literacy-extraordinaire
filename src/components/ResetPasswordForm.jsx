import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { updatePassword } from '../lib/auth';
import * as s from './authStyles';

export default function ResetPasswordForm() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });

    // The recovery link may have already been consumed before this listener
    // attached, in which case a session already exists.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      setStatus('error');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    const { error } = await updatePassword(password);

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    setStatus('done');
  };

  if (status === 'done') {
    return (
      <div style={s.card}>
        <div style={s.successBox}>Your password has been updated.</div>
        <p style={s.linkRow}>
          <a href="/login" style={s.link}>Log in with your new password</a>
        </p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={s.card}>
        <h1 style={s.heading}>Reset your password</h1>
        <p style={s.subtext}>Open this page from the reset link in your email to continue.</p>
      </div>
    );
  }

  return (
    <div style={s.card}>
      <h1 style={s.heading}>Choose a new password</h1>

      {status === 'error' && <div style={s.errorBox}>{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === 'loading'}
            style={s.input}
          />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={status === 'loading'}
            style={s.input}
          />
        </div>

        <button type="submit" disabled={status === 'loading'} style={s.buttonPrimary(status === 'loading')}>
          {status === 'loading' ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
