export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="blob blob-blue" style={{ width: 520, height: 520, top: 0, right: -100, animationDelay: '0s' }} />
      <div className="blob blob-purple" style={{ width: 420, height: 420, bottom: 0, left: -80, animationDelay: '2.5s' }} />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          ✨ Trusted by 50K+ Travelers Worldwide
        </div>

        <h1>
          Travel Smarter with<br />
          <span className="grad-text">AI-Powered Planning</span>
        </h1>

        <p className="hero-sub">
          Let AI handle the details while you focus on the adventure. Personalized itineraries, smart recommendations, and seamless coordination — all in one platform.
        </p>

        <div className="hero-checks">
          {['Free to start', 'No credit card needed', 'Ready in 30 seconds'].map(text => (
            <div className="hero-check" key={text}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {text}
            </div>
          ))}
        </div>

        <div className="hero-form glass">
          <div className="form-grid">
            <div className="form-group">
              <label>Destination</label>
              <input className="form-control" type="text" placeholder="e.g. Bali, Paris…" />
            </div>
            <div className="form-group">
              <label>Travel Date</label>
              <input className="form-control" type="date" />
            </div>
            <div className="form-group">
              <label>Budget</label>
              <select className="form-control">
                <option value="">Select budget</option>
                <option>$500 – $1,000</option>
                <option>$1,000 – $2,000</option>
                <option>$2,000 – $5,000</option>
                <option>$5,000+</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration</label>
              <select className="form-control">
                <option value="">Select days</option>
                <option>3 Days</option>
                <option>5 Days</option>
                <option>7 Days</option>
                <option>10+ Days</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-hero-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              Generate AI Trip
            </button>
            <button className="btn-hero-secondary">🌍 Explore Destinations</button>
          </div>
        </div>

        <div className="hero-stats">
          {[
            { num: '50K+', label: 'Destinations' },
            { num: '500K+', label: 'Happy Travelers' },
            { num: '100K+', label: 'Itineraries Created' },
            { num: '99%', label: 'Satisfaction Rate' },
          ].map(({ num, label }) => (
            <div className="stat-card" key={label}>
              <div className="stat-num">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
