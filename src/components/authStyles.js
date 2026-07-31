// Shared inline-style tokens for the auth form components
// (LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm, ProfileMenu).
export const colors = {
  bg: '#0A0A12',
  purple: '#7B2FF2',
  orange: '#FF6B35',
  gold: '#FFD23F',
  cyan: '#4FD1E8',
};

export const card = {
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '20px',
  border: '1px solid rgba(168,130,255,0.15)',
  background: 'linear-gradient(135deg, rgba(18,10,35,0.95), rgba(30,15,55,0.9))',
  padding: '40px 32px',
  maxWidth: '440px',
  margin: '0 auto',
  fontFamily: "'Inter', sans-serif",
};

export const heading = {
  fontSize: 'clamp(22px,4vw,28px)',
  fontWeight: 700,
  color: '#f0e8ff',
  lineHeight: 1.25,
  marginBottom: '8px',
};

export const subtext = {
  fontSize: '14px',
  color: 'rgba(200,190,220,0.75)',
  lineHeight: 1.6,
  marginBottom: '24px',
};

export const label = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '6px',
};

export const input = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(168,130,255,0.25)',
  background: 'rgba(255,255,255,0.05)',
  color: '#f0e8ff',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
};

export const select = {
  ...input,
  cursor: 'pointer',
  appearance: 'auto',
};

export const fieldGroup = { marginBottom: '16px' };

export const buttonPrimary = (loading) => ({
  width: '100%',
  padding: '13px 24px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg,#9b59f0,#e67e22)',
  color: '#fff',
  fontSize: '15px',
  fontWeight: 700,
  fontFamily: "'Inter', sans-serif",
  cursor: loading ? 'wait' : 'pointer',
  opacity: loading ? 0.75 : 1,
  marginTop: '4px',
});

export const errorBox = {
  padding: '12px 14px',
  borderRadius: '10px',
  background: 'rgba(255,107,107,0.08)',
  border: '1px solid rgba(255,107,107,0.25)',
  color: '#ff6b6b',
  fontSize: '13px',
  marginBottom: '16px',
};

export const successBox = {
  padding: '16px',
  borderRadius: '14px',
  background: 'rgba(80,200,120,0.08)',
  border: '1px solid rgba(80,200,120,0.25)',
  color: '#50c878',
  fontSize: '14px',
};

export const linkRow = {
  marginTop: '20px',
  fontSize: '13px',
  color: 'rgba(200,190,220,0.6)',
  textAlign: 'center',
};

export const link = {
  color: '#c8a0ff',
  fontWeight: 600,
  textDecoration: 'none',
};
