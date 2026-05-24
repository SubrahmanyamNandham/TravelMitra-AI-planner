import { useState, useEffect } from 'react'
import { clearAccessToken, getAccessToken, logout } from '../../api'
import { useTheme } from '../../context/ThemeContext'

type Page = 'home' | 'login' | 'signup' | 'ai' | 'trips' | 'jsonViewer'

interface Props {
  onNavigate: (page: Page) => void
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export default function Navbar({ onNavigate }: Props) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessToken()))
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    const syncAuthState = () => setIsAuthenticated(Boolean(getAccessToken()))

    syncAuthState()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('storage', syncAuthState)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('storage', syncAuthState)
    }
  }, [])

  const toggleMenu = (open: boolean) => {
    setIsMenuOpen(open)
    document.body.style.overflow = open ? 'hidden' : ''
  }

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      toggleMenu(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      clearAccessToken()
      setIsAuthenticated(false)
      toggleMenu(false)
      onNavigate('home')
    }
  }

  return (
    <>
      <nav id="navbar">
        <div className={`nav-inner${isScrolled ? ' scrolled' : ''}`}>
          <div className="nav-logo" onClick={() => onNavigate('home')}>
            <div className="nav-logo-icon">T</div>
            <span className="nav-logo-text">TravelMitra.io</span>
          </div>

          <div className="nav-links">
            {[
              { href: '#features', label: 'Features' },
              { href: '#destinations', label: 'Destinations' },
              { href: '#ai-chat', label: 'AI Chat' },
              { href: '#newsletter', label: 'Newsletter' },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="nav-link" onClick={e => handleAnchorClick(e, href)}>
                {label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button
              className={`theme-toggle-btn${theme === 'light' ? ' is-light' : ''}`}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              <span className="theme-toggle-track">
                <span className="theme-toggle-thumb">
                  {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
                </span>
              </span>
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('ai')}>AI Planner</button>
            <button className="btn-ghost" onClick={() => onNavigate('trips')}>My Trips</button>
            {isAuthenticated ? (
              <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            ) : (
              <button className="btn-ghost" onClick={() => onNavigate('login')}>Login</button>
            )}
            <button className="btn-primary" onClick={() => onNavigate('signup')}>
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            className={`nav-toggle${isMenuOpen ? ' open' : ''}`}
            onClick={() => toggleMenu(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-overlay${isMenuOpen ? ' open' : ''}`} onClick={() => toggleMenu(false)} />

      <div className={`nav-drawer${isMenuOpen ? ' open' : ''}`}>
        <button
          className={`theme-toggle-btn drawer-theme-btn${theme === 'light' ? ' is-light' : ''}`}
          onClick={toggleTheme}
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb">
              {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
            </span>
          </span>
          <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        {[
          { href: '#features', label: 'Features' },
          { href: '#destinations', label: 'Destinations' },
          { href: '#ai-chat', label: 'AI Chat' },
          { href: '#newsletter', label: 'Newsletter' },
        ].map(({ href, label }) => (
          <a key={href} href={href} className="drawer-link" onClick={e => handleAnchorClick(e, href)}>
            {label} <span>→</span>
          </a>
        ))}
        <button className="drawer-link" onClick={() => { toggleMenu(false); onNavigate('ai') }}>
          AI Planner <span>→</span>
        </button>
        <button className="drawer-link" onClick={() => { toggleMenu(false); onNavigate('trips') }}>
          My Trips <span>→</span>
        </button>
        {isAuthenticated ? (
          <button className="drawer-cta" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="drawer-cta" onClick={() => { toggleMenu(false); onNavigate('login') }}>
            Login
          </button>
        )}
      </div>
    </>
  )
}
