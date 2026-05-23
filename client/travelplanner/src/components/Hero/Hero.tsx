import { type ChangeEvent, type FormEvent, useState } from 'react'
import { generateTrip, getAccessToken } from '../../api'

type Page = 'home' | 'login' | 'signup' | 'ai' | 'trips'

type TravelStyle = 'budget' | 'comfort' | 'luxury'

interface Props {
  onNavigate: (page: Page) => void
}

interface HeroFormData {
  destination: string
  country: string
  date: string
  budget: string
  duration: string
  interests: string
}

const TRAVEL_STYLE_OPTIONS = [
  { value: 'budget' as const, label: 'Budget' },
  { value: 'comfort' as const, label: 'Comfort' },
  { value: 'luxury' as const, label: 'Luxury' }
]

export default function Hero({ onNavigate }: Props) {
  const [form, setForm] = useState<HeroFormData>({
    destination: '',
    country: '',
    date: '',
    budget: '1500',
    duration: '5',
    interests: 'culture, food, nature'
  })
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('comfort')
  const [saveTrip, setSaveTrip] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isAuthenticated = Boolean(getAccessToken())

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm(previous => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!form.destination.trim() || !form.country.trim()) {
      setErrorMessage('Add a destination and country to generate an itinerary.')
      return
    }

    if (!isAuthenticated) {
      setErrorMessage('Sign in to generate and save your AI itinerary.')
      return
    }

    setIsSubmitting(true)

    try {
      await generateTrip({
        destination: form.destination.trim(),
        country: form.country.trim(),
        duration_days: Number(form.duration) || 5,
        budget: Number(form.budget) || 1500,
        currency: 'USD',
        interests: form.interests.split(',').map(item => item.trim()).filter(Boolean),
        travel_style: travelStyle,
        save_trip: saveTrip
      })

      if (saveTrip) {
        setSuccessMessage('Trip saved to your account.')
      } else {
        setSuccessMessage('Trip generated successfully. Open the AI planner to review the itinerary.')
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to generate itinerary')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="hero" id="hero">
      <div className="blob blob-blue" style={{ width: 520, height: 520, top: 0, right: -100, animationDelay: '0s' }} />
      <div className="blob blob-purple" style={{ width: 420, height: 420, bottom: 0, left: -80, animationDelay: '2.5s' }} />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          ✨ Trusted by 100K+ Travelers Worldwide
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

        <form className="hero-form glass" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <input id="destination" name="destination" className="form-control" type="text" placeholder="e.g. Bali, Paris…" value={form.destination} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input id="country" name="country" className="form-control" type="text" placeholder="e.g. Indonesia, France" value={form.country} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="date">Travel Date</label>
              <input id="date" name="date" className="form-control" type="date" value={form.date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <select id="duration" name="duration" className="form-control" value={form.duration} onChange={handleChange}>
                <option value="3">3 days</option>
                <option value="5">5 days</option>
                <option value="7">7 days</option>
                <option value="10">10+ days</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="budget">Budget</label>
              <select id="budget" name="budget" className="form-control" value={form.budget} onChange={handleChange}>
                <option value="1000">$1,000</option>
                <option value="1500">$1,500</option>
                <option value="2500">$2,500</option>
                <option value="4000">$4,000</option>
                <option value="6000">$6,000</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="interests">Interests</label>
              <input id="interests" name="interests" className="form-control" type="text" placeholder="culture, food, nature" value={form.interests} onChange={handleChange} />
            </div>
                <div className="form-group" style={{ maxWidth: 320 }}>
              <label htmlFor="travelStyle">Travel style</label>
              <select
                id="travelStyle"
                className="form-control"
                value={travelStyle}
                onChange={event => setTravelStyle(event.target.value as TravelStyle)}
              >
                {TRAVEL_STYLE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text2)', fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={saveTrip} onChange={event => setSaveTrip(event.target.checked)} style={{ accentColor: '#3b82f6', width: 16, height: 16 }} />
              Save this trip to my account
            </label>
            <button type="button" onClick={() => onNavigate('ai')} style={{ background: 'transparent', border: 'none', color: 'var(--blue-light)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              Open full AI planner
            </button>
          </div>

          {errorMessage && (
            <div style={{ marginTop: 16, borderRadius: 14, padding: '12px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.32)', color: '#fecaca' }}>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div style={{ marginTop: 16, borderRadius: 14, padding: '12px 14px', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#dcfce7' }}>
              {successMessage}
            </div>
          )}

          <div className="form-actions" style={{ marginTop: 20 }}>
            <button className="btn-hero-primary" type="submit" disabled={isSubmitting || !isAuthenticated}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              {isSubmitting ? 'Generating…' : 'Generate AI Trip'}
            </button>
            <button type="button" className="btn-hero-secondary" onClick={() => onNavigate('trips')}>
              🌍 View saved trips
            </button>
          </div>
        </form>

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
