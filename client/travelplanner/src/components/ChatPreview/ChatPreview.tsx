import { useState } from 'react'

export default function ChatPreview() {
  const [inputValue, setInputValue] = useState('')

  return (
    <section className="section chat-section" id="ai-chat">
      <div className="blob blob-blue" style={{ width: 360, height: 360, top: '20%', left: '33%', opacity: 0.08, animationDelay: '1s' }} />
      <div className="blob blob-purple" style={{ width: 320, height: 320, bottom: '20%', right: '33%', opacity: 0.08, animationDelay: '3s' }} />

      <div className="container">
        <div className="section-head">
          <div className="section-badge badge-blue">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Powered by Advanced AI
          </div>
          <h2>Meet Your AI Travel<br /><span className="grad-text">Planning Assistant</span></h2>
          <p>Chat naturally about your travel dreams and watch as our AI creates personalized itineraries, finds hidden gems, and optimizes every detail.</p>
        </div>

        <div className="chat-card">
          <div className="chat-body">
            <div className="chat-messages">
              <div className="chat-msg-user">
                <div className="chat-bubble-user">
                  Plan me a 7-day trip to Japan in spring — I love history, street food, and hidden temples. Budget around $2,000.
                </div>
              </div>
              <div className="chat-msg-ai">
                <div className="chat-bubble-ai">
                  <strong style={{ color: 'var(--blue-light)', display: 'block', marginBottom: 8 }}>🗾 Your Perfect Japan Itinerary</strong>
                  <strong>Day 1–2 · Tokyo</strong> — Explore Senso-ji at dawn before crowds, tsukemen ramen in Shimokitazawa, teamLab digital art.<br /><br />
                  <strong>Day 3–4 · Kyoto</strong> — Fushimi Inari at sunrise, Nishiki Market street food, hidden Nanzen-ji aqueduct walk.<br /><br />
                  <strong>Day 5–6 · Nara + Osaka</strong> — Free-roaming deer at Todai-ji, takoyaki &amp; kushikatsu on Dotonbori. Under budget by $180! ✨
                </div>
              </div>
            </div>

            <div className="chat-divider" />

            <div className="chat-input-row">
              <input
                className="chat-input"
                type="text"
                placeholder="Ask me anything about your next adventure…"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
              <button className="chat-send-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        <div className="chat-features">
          {[
            { icon: '⚡', title: 'Instant Responses', desc: 'Recommendations in seconds' },
            { icon: '🎯', title: 'Personalized Plans', desc: 'Tailored to your preferences' },
            { icon: '🌙', title: '24 / 7 Available', desc: 'Your AI never sleeps' },
          ].map(({ icon, title, desc }) => (
            <div className="chat-feat" key={title}>
              <div className="chat-feat-icon">{icon}</div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
