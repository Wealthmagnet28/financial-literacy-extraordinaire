import { useState } from 'react';
import { sendPasswordReset } from '../lib/auth';
import * as s from './authStyles';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const { error } = await sendPasswordReset(email.trim());

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div style={s.card}>
        <div style={s.successBox}>
          If an account exists for {email.trim()}, we sent a password reset link. Check your inbox.
        </div>
        <p style={s.linkRow}>
          <a href="/login" style={s.link}>Back to login</a>
        </p>
      </div>
    );
  }

  return (
    <div style={s.card}>
      <h1 style={s.heading}>Reset your password</h1>
      <p style={s.subtext}>Enter your email and we'll send you a link to reset your password.</p>

      {status === 'error' && <div style={s.errorBox}>{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            style={s.input}
          />
        </div>

        <button type="submit" disabled={status === 'loading'} style={s.buttonPrimary(status === 'loading')}>
          {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p style={s.linkRow}>
        Remembered it? <a href="/login" style={s.link}>Log in</a>
      </p>
    </div>
  );
}
