import { useState } from 'react';
import { signIn } from '../lib/auth';
import * as s from './authStyles';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const { error } = await signIn({ email: email.trim(), password });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message === 'Invalid login credentials'
        ? 'Incorrect email or password. Please try again.'
        : error.message);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    window.location.href = params.get('redirect') || '/';
  };

  return (
    <div style={s.card}>
      <h1 style={s.heading}>Welcome back</h1>
      <p style={s.subtext}>Log in to keep building your financial future.</p>

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

        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === 'loading'}
            style={s.input}
          />
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <a href="/forgot-password" style={{ ...s.link, fontSize: '13px' }}>Forgot password?</a>
        </div>

        <button type="submit" disabled={status === 'loading'} style={s.buttonPrimary(status === 'loading')}>
          {status === 'loading' ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p style={s.linkRow}>
        Don't have an account? <a href="/signup" style={s.link}>Sign up</a>
      </p>
    </div>
  );
}
