import { useEffect, useRef, useState } from 'react';
import { getSession, getProfile, updateProfile, uploadAvatar } from '../lib/auth';
import * as s from './authStyles';

const AGE_TIERS = [
  { value: 'kids', label: 'Kids (5–9)' },
  { value: 'teens', label: 'Teens (10–13)' },
  { value: 'young-adults', label: 'Young Adults (14–18)' },
  { value: 'adults', label: 'Adults (19+)' },
];

export default function ProfileForm() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [ageTier, setAgeTier] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) return;
      setUserId(session.user.id);
      const profile = await getProfile(session.user.id);
      if (profile) {
        setDisplayName(profile.display_name || '');
        setAgeTier(profile.age_tier || '');
        setDateOfBirth(profile.date_of_birth || '');
        setAvatarUrl(profile.avatar_url || null);
      }
      setLoading(false);
    })();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
      const { url, error: uploadError } = await uploadAvatar(userId, avatarFile);
      if (uploadError) {
        setStatus('error');
        setErrorMsg(uploadError.message || 'Could not upload avatar.');
        return;
      }
      newAvatarUrl = url;
    }

    const { error } = await updateProfile(userId, {
      display_name: displayName.trim(),
      age_tier: ageTier,
      date_of_birth: dateOfBirth || null,
      avatar_url: newAvatarUrl,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    setAvatarUrl(newAvatarUrl);
    setAvatarFile(null);
    setStatus('saved');
  };

  if (loading) return null;

  const initials = (displayName || 'M').trim().slice(0, 1).toUpperCase();
  const previewSrc = avatarPreview || avatarUrl;

  return (
    <div style={{ ...s.card, maxWidth: '520px' }}>
      <h1 style={s.heading}>Your Profile</h1>
      <p style={s.subtext}>Update your display name, avatar, and age tier.</p>

      {status === 'error' && <div style={s.errorBox}>{errorMsg}</div>}
      {status === 'saved' && <div style={{ ...s.successBox, marginBottom: '16px' }}>Profile updated.</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
              background: previewSrc
                ? `url(${previewSrc}) center/cover`
                : `linear-gradient(135deg, ${s.colors.purple}, ${s.colors.orange})`,
              border: '2px solid rgba(255,255,255,0.1)',
            }}
          >
            {!previewSrc && initials}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(168,130,255,0.25)',
                background: 'rgba(255,255,255,0.05)',
                color: '#c8a0ff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Change Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            required
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
          <label style={s.label} htmlFor="dateOfBirth">Date of Birth (optional)</label>
          <input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth || ''}
            onChange={(e) => setDateOfBirth(e.target.value)}
            disabled={status === 'loading'}
            style={s.input}
          />
        </div>

        <button type="submit" disabled={status === 'loading'} style={s.buttonPrimary(status === 'loading')}>
          {status === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
