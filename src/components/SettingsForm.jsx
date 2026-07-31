import { useEffect, useState } from 'react';
import { getSession, getProfile, updateProfile, updatePassword, signIn, signOut } from '../lib/auth';
import * as s from './authStyles';

const sectionCard = { ...s.card, maxWidth: '560px', marginBottom: '24px' };
const sectionHeading = { ...s.heading, fontSize: '1.15rem', marginBottom: '4px' };

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '999px',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        position: 'relative',
        background: checked ? `linear-gradient(135deg, ${s.colors.purple}, ${s.colors.orange})` : 'rgba(255,255,255,0.12)',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
        }}
      />
    </button>
  );
}

export default function SettingsForm() {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwStatus, setPwStatus] = useState('idle');
  const [pwError, setPwError] = useState('');

  const [prefs, setPrefs] = useState({
    notify_weekly_summary: true,
    notify_budget_alerts: true,
    notify_goal_reminders: true,
  });
  const [prefsSaving, setPrefsSaving] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteStatus, setDeleteStatus] = useState('idle');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) return;
      setUserId(session.user.id);
      setEmail(session.user.email);
      const profile = await getProfile(session.user.id);
      if (profile) {
        setPrefs({
          notify_weekly_summary: profile.notify_weekly_summary ?? true,
          notify_budget_alerts: profile.notify_budget_alerts ?? true,
          notify_goal_reminders: profile.notify_goal_reminders ?? true,
        });
      }
      setLoading(false);
    })();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      setPwStatus('error');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      setPwStatus('error');
      return;
    }

    setPwStatus('loading');

    const { error: signInError } = await signIn({ email, password: currentPassword });
    if (signInError) {
      setPwStatus('error');
      setPwError('Current password is incorrect.');
      return;
    }

    const { error } = await updatePassword(newPassword);
    if (error) {
      setPwStatus('error');
      setPwError(error.message);
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwStatus('saved');
  };

  const handleTogglePref = async (key, value) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    setPrefsSaving(true);
    await updateProfile(userId, { [key]: value });
    setPrefsSaving(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (deleteConfirmText.trim().toLowerCase() !== email.toLowerCase()) {
      setDeleteError('Type your email exactly to confirm.');
      setDeleteStatus('error');
      return;
    }

    setDeleteStatus('loading');

    const { error: signInError } = await signIn({ email, password: deletePassword });
    if (signInError) {
      setDeleteStatus('error');
      setDeleteError('Password is incorrect.');
      return;
    }

    const session = await getSession();
    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setDeleteStatus('error');
      setDeleteError(body.error || 'Could not delete account. Try again.');
      return;
    }

    await signOut();
    window.location.href = '/';
  };

  if (loading) return null;

  return (
    <div>
      {/* PASSWORD */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Password</h2>
        <p style={s.subtext}>Change your account password.</p>

        {pwStatus === 'error' && <div style={s.errorBox}>{pwError}</div>}
        {pwStatus === 'saved' && <div style={{ ...s.successBox, marginBottom: '16px' }}>Password updated.</div>}

        <form onSubmit={handlePasswordSubmit}>
          <div style={s.fieldGroup}>
            <label style={s.label} htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={pwStatus === 'loading'}
              style={s.input}
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label} htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={pwStatus === 'loading'}
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
              disabled={pwStatus === 'loading'}
              style={s.input}
            />
          </div>
          <button type="submit" disabled={pwStatus === 'loading'} style={s.buttonPrimary(pwStatus === 'loading')}>
            {pwStatus === 'loading' ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* NOTIFICATIONS */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Notifications</h2>
        <p style={s.subtext}>Choose what Club FLE keeps you posted on.{prefsSaving ? ' Saving...' : ''}</p>

        {[
          { key: 'notify_weekly_summary', label: 'Weekly summary', desc: 'A recap of your spending and progress each week.' },
          { key: 'notify_budget_alerts', label: 'Budget alerts', desc: 'Heads up when you’re close to or over budget.' },
          { key: 'notify_goal_reminders', label: 'Goal reminders', desc: 'Nudges to keep your savings goals on track.' },
        ].map((item) => (
          <div
            key={item.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '14px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div>
              <p style={{ color: '#f0e8ff', fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{item.label}</p>
              <p style={{ color: 'rgba(200,190,220,0.55)', fontSize: '12px' }}>{item.desc}</p>
            </div>
            <Toggle checked={prefs[item.key]} onChange={(v) => handleTogglePref(item.key, v)} />
          </div>
        ))}
      </div>

      {/* DANGER ZONE */}
      <div style={{ ...sectionCard, border: '1px solid rgba(255,107,107,0.25)', marginBottom: 0 }}>
        <h2 style={{ ...sectionHeading, color: '#ff6b6b' }}>Delete Account</h2>
        <p style={s.subtext}>
          This permanently deletes your account and all associated data — budgets, transactions, goals, and your profile.
          This cannot be undone.
        </p>

        {deleteStatus === 'error' && <div style={s.errorBox}>{deleteError}</div>}

        <form onSubmit={handleDelete}>
          <div style={s.fieldGroup}>
            <label style={s.label} htmlFor="deleteConfirm">Type your email ({email}) to confirm</label>
            <input
              id="deleteConfirm"
              type="text"
              required
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              disabled={deleteStatus === 'loading'}
              style={s.input}
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label} htmlFor="deletePassword">Password</label>
            <input
              id="deletePassword"
              type="password"
              required
              autoComplete="current-password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              disabled={deleteStatus === 'loading'}
              style={s.input}
            />
          </div>
          <button
            type="submit"
            disabled={deleteStatus === 'loading'}
            style={{
              width: '100%',
              padding: '13px 24px',
              borderRadius: '10px',
              border: '1px solid rgba(255,107,107,0.4)',
              background: 'rgba(255,107,107,0.1)',
              color: '#ff6b6b',
              fontSize: '15px',
              fontWeight: 700,
              cursor: deleteStatus === 'loading' ? 'wait' : 'pointer',
              opacity: deleteStatus === 'loading' ? 0.7 : 1,
            }}
          >
            {deleteStatus === 'loading' ? 'Deleting...' : 'Permanently Delete Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
