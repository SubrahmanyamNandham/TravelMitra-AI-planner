const features = [
  { icon: '🤖', title: 'AI Itinerary Builder', desc: 'Tell our AI your dream trip and get a personalized day-by-day plan in seconds — complete with timings, local tips, and hidden gems.' },
  { icon: '🌐', title: 'Real-Time Recommendations', desc: 'Get live updates on flights, hotels, and activities. Our AI adapts your itinerary based on weather, local events, and availability.' },
  { icon: '💰', title: 'Smart Budget Tracking', desc: 'Stay on budget effortlessly. Our AI monitors your spending and suggests cost-effective alternatives without compromising the experience.' },
  { icon: '🗺️', title: 'Interactive Maps', desc: 'Visualize your entire journey on interactive maps with route optimization, distance calculations, and offline access for any destination.' },
  { icon: '👥', title: 'Group Trip Planner', desc: 'Collaborate in real-time with your travel group. Vote on destinations, split costs, and sync itineraries — planning made social.' },
  { icon: '🔔', title: '24/7 Travel Alerts', desc: 'Never miss a beat. Get instant notifications for flight changes, price drops, booking confirmations, and travel advisories.' },
]

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="blob blob-blue" style={{ width: 400, height: 400, top: -100, right: -100, opacity: 0.1 }} />
      <div className="blob blob-purple" style={{ width: 350, height: 350, bottom: -80, left: -80, opacity: 0.1, animationDelay: '3s' }} />

      <div className="container">
        <div className="section-head">
          <div className="section-badge badge-blue">✨ Powerful Features</div>
          <h2>Everything You Need for<br /><span className="grad-text">Smart Travel Planning</span></h2>
          <p>From AI-powered recommendations to real-time updates, our platform handles every detail so you can focus on experiencing the world.</p>
        </div>

        <div className="features-grid">
          {features.map(({ icon, title, desc }) => (
            <div className="feature-card" key={title}>
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <div className="feature-link">Learn more <span className="feature-link-arrow">→</span></div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button className="btn-hero-primary" style={{ display: 'inline-flex', width: 'auto', padding: '14px 32px' }}>
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  )
}
