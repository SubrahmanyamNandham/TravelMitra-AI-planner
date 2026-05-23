const testimonials = [
  {
    quote: '"TravelMitra.io planned my entire honeymoon in Santorini — every restaurant, every sunset spot, even a private boat tour. It was absolutely magical. I couldn\'t have done it without AI."',
    name: 'Sarah Mitchell', role: 'Travel Blogger · @sarahwanders', avatar: 'https://i.pravatar.cc/96?img=47',
  },
  {
    quote: '"I was skeptical at first, but the AI built a 10-day Southeast Asia itinerary that fit my exact budget and interests. Found restaurants I never would have discovered on my own."',
    name: 'James Kwon', role: 'Digital Nomad · Seoul', avatar: 'https://i.pravatar.cc/96?img=12',
  },
  {
    quote: '"Planning a group trip for 8 people used to be a nightmare. TravelMitra.io handled the voting, cost splitting, and scheduling in one place. Everyone was happy — truly a miracle!"',
    name: 'Priya Sharma', role: 'Product Manager · Mumbai', avatar: 'https://i.pravatar.cc/96?img=32',
  },
]

const proofStats = [
  { val: '500K+', label: 'Active Users' },
  { val: '2M+', label: 'Trips Planned' },
  { val: '4.9 ★', label: 'Avg Rating' },
  { val: '195', label: 'Countries' },
]

export default function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="blob blob-blue" style={{ width: 340, height: 340, top: '10%', left: '5%', opacity: 0.06, animationDelay: '4s' }} />

      <div className="container">
        <div className="section-head">
          <div className="section-badge badge-purple">⭐ Real Reviews</div>
          <h2>Trusted by Travelers<br /><span className="grad-text">Around the World</span></h2>
          <p>Join thousands of happy travelers who've already transformed their adventures with TravelMitra.io.</p>
        </div>

        <div className="testi-grid">
          {testimonials.map(({ quote, name, role, avatar }) => (
            <div className="testi-card" key={name}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">{quote}</p>
              <div className="testi-author">
                <img className="testi-avatar" src={avatar} alt={name} />
                <div>
                  <div className="testi-author-name">{name}</div>
                  <div className="testi-author-role">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="proof-grid">
          {proofStats.map(({ val, label }) => (
            <div className="proof-card" key={label}>
              <div className="proof-val">{val}</div>
              <div className="proof-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
