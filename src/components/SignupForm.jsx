import { useState } from 'react';
import { signUp } from '../lib/auth';
import * as s from './authStyles';

const AGE_TIERS = [
  { value: 'kids', label: 'Kids (5–9)' },
  { value: 'teens', label: 'Teens (10–13)' },
  { value: 'young-adults', label: 'Young Adults (14–18)' },
  { value: 'adults', label: 'Adults (19+)' },
];

export default function SignupForm() {
  const [displayName, setDisplayName] = useState('');
  const [ageTier, setAgeTier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

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
    if (!ageTier) {
      setErrorMsg('Please select an age tier.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    const { data, error } = await signUp({
      email: email.trim(),
      password,
      displayName: displayName.trim(),
      ageTier,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    if (data.session) {
      window.location.href = '/';
      return;
    }

    // Email confirmation is required before a session is issued.
    setStatus('confirm-email');
  };

  if (status === 'confirm-email') {
    return (
      <div style={s.card}>
        <div style={s.successBox}>
          <strong>Almost there!</strong> We sent a confirmation link to {email.trim()}.
          Click it, then log in to get started.
        </div>
        <p style={s.linkRow}>
          <a href="/login" style={s.link}>Go to login</a>
        </p>
      </div>
    );
  }

  return (
    <div style={s.card}>
      <h1 style={s.heading}>Create your account</h1>
      <p style={s.subtext}>Join Club FLE and start building real money skills.</p>

      {status === 'error' && <div style={s.errorBox}>{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            required
            autoComplete="nickname"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={status === 'loading'}
            style={s.input}
          />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="ageTier">Age Tier</label>
          <select
            id="ageTier"
            required
            value={ageTier}
            onChange={(e) => setAgeTier(e.target.value)}
            disabled={status === 'loading'}
            style={s.select}
          >
            <option value="" disabled>Select your age tier</option>
            {AGE_TIERS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === 'loading'}
            style={s.input}
          />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="confirmPassword">Confirm Password</label>
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

        <button type="submit" disabled={status === 'loading'} style={{ ...s.buttonPrimary(status === 'loading'), marginTop: '8px' }}>
          {status === 'loading' ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p style={s.linkRow}>
        Already have an account? <a href="/login" style={s.link}>Log in</a>
      </p>
    </div>
  );
}
