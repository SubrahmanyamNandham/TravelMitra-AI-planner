export default function Footer() {
  return (
    <footer>
      <div className="blob blob-blue" style={{ width: 420, height: 420, bottom: 60, right: 40, opacity: 0.06, animationDelay: '1s' }} />
      <div className="blob blob-purple" style={{ width: 380, height: 380, top: 60, left: 20, opacity: 0.06, animationDelay: '3s' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              <div className="nav-logo-icon">T</div>
              <span className="nav-logo-text">TravelMitra.io</span>
            </div>
            <p>Your AI-powered travel companion for creating unforgettable journeys around the world. Smart planning, boundless adventures.</p>
            <div className="footer-app-badge">📱 Available on iOS &amp; Android</div>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <div className="footer-links">
              {['Features', 'Pricing', 'Security', 'Blog'].map(item => (
                <a href="#" className="footer-link" key={item}>{item} <span className="footer-link-arrow">↗</span></a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <div className="footer-links">
              {['About Us', 'Careers', 'Press Kit', 'Contact'].map(item => (
                <a href="#" className="footer-link" key={item}>{item} <span className="footer-link-arrow">↗</span></a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <div className="footer-links">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'License'].map(item => (
                <a href="#" className="footer-link" key={item}>{item} <span className="footer-link-arrow">↗</span></a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Subrahmanyam/TravelMitra.io, Inc. All rights reserved. Made with ❤️ for travelers everywhere.</p>
          <div className="footer-socials">
            <a href="#" className="social-btn" title="Twitter">𝕏</a>
            <a href="#" className="social-btn" title="Facebook">f</a>
            <a href="#" className="social-btn" title="Instagram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="social-btn" title="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
