import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <section className="section newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-card">
          <div className="blob blob-blue" style={{ width: 300, height: 300, top: -80, left: -60, opacity: 0.12, animationDelay: '0s' }} />
          <div className="blob blob-purple" style={{ width: 280, height: 280, bottom: -60, right: -40, opacity: 0.12, animationDelay: '2s' }} />

          <div className="newsletter-icon">📩</div>
          <h2>Never Miss Travel<br /><span className="grad-text">Deals &amp; Inspiration</span></h2>
          <p>Get weekly travel tips, exclusive deals, and AI-powered recommendations tailored to your interests. Join 50K+ travelers already enjoying insider benefits.</p>

          <div className="newsletter-form">
            <input
              className="newsletter-input"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button className="btn-newsletter" onClick={handleSubscribe}>
              <span>{subscribed ? '✓ Subscribed!' : 'Subscribe'}</span>
              {!subscribed && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          <div className="newsletter-perks">
            {[
              { icon: '📧', strong: 'Weekly Tips', span: 'Travel hacks & guides' },
              { icon: '🎉', strong: 'Exclusive Deals', span: 'Limited offers first' },
              { icon: '🤖', strong: 'AI Picks', span: 'Personalized for you' },
            ].map(({ icon, strong, span }) => (
              <div className="perk" key={strong}>
                <span className="perk-icon">{icon}</span>
                <strong>{strong}</strong>
                <span>{span}</span>
              </div>
            ))}
          </div>

          <p className="newsletter-note">✓ No spam, ever. Unsubscribe anytime. By subscribing, you agree to our Privacy Policy.</p>
        </div>
      </div>
    </section>
  )
}
