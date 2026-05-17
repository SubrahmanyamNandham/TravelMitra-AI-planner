import { useState } from 'react'

const BG = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80'

interface Props {
  onNavigate: (page: 'home' | 'login' | 'signup') => void
}

export default function SignUpPage({ onNavigate }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [agreed, setAgreed] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'][strength]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div
      className="auth-page"
      style={{
        background: `linear-gradient(135deg, rgba(5,8,22,0.90) 0%, rgba(13,18,36,0.88) 100%), url('${BG}') center/cover no-repeat fixed`,
      }}
    >
      <div className="auth-bg-blobs">
        <div className="blob blob-purple" style={{ width: 500, height: 500, top: -100, left: -100, opacity: 0.18 }} />
        <div className="blob blob-blue" style={{ width: 400, height: 400, bottom: -80, right: -80, opacity: 0.15, animationDelay: '2s' }} />
      </div>

      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo" onClick={() => onNavigate('home')}>
          <div className="nav-logo-icon">T</div>
          <span className="nav-logo-text">TravelMitra.io</span>
        </div>

        <div className="auth-card glass">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-header-icon">🌍</div>
            <h1 className="auth-title">Start your journey</h1>
            <p className="auth-subtitle">Create a free account and plan your dream trip with AI</p>
          </div>

          {/* Social Buttons */}
          <div className="auth-socials">
            <button className="auth-social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign up with Google
            </button>
            <button className="auth-social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Sign up with Facebook
            </button>
          </div>

          <div className="auth-divider">
            <span>or create account with email</span>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-fields-row">
              <div className="auth-field">
                <label htmlFor="name">Full Name</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input id="name" className="auth-input" type="text" placeholder="John Doe" value={form.name} onChange={set('name')} required />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-email">Email Address</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input id="signup-email" className="auth-input" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="signup-password"
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={set('password')}
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="auth-strength-bar"
                        style={{ background: i <= strength ? strengthColor : 'rgba(255,255,255,0.1)' }}
                      />
                    ))}
                  </div>
                  <span style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="confirm">Confirm Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <input
                  id="confirm"
                  className={`auth-input${form.confirm && form.confirm !== form.password ? ' auth-input-error' : ''}`}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="auth-field-error">Passwords do not match</p>
              )}
            </div>

            <label className="auth-checkbox-label auth-terms">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required />
              <span className="auth-checkbox-custom" />
              <span>
                I agree to the{' '}
                <a href="#" className="auth-text-link">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="auth-text-link">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" className="auth-submit-btn auth-submit-btn--signup">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Create Free Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="auth-switch-link">
              Sign in →
            </button>
          </p>
        </div>

        {/* Trust badges */}
        <div className="auth-trust">
          <span>🔒 256-bit SSL</span>
          <span>✓ Free forever</span>
          <span>🌍 195 countries</span>
        </div>
      </div>
    </div>
  )
}
