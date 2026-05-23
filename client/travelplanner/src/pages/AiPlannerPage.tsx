import { type FormEvent, useState } from 'react'
import { generateTrip, getAccessToken } from '../api'
import type { Trip } from '../api'

type Page = 'home' | 'login' | 'signup' | 'ai' | 'trips'

interface Props {
  onNavigate: (page: Page) => void
}

export default function AiPlannerPage({ onNavigate }: Props) {
  const [destination, setDestination] = useState('')
  const [country, setCountry] = useState('')
  const [days, setDays] = useState(5)
  const [budget, setBudget] = useState(1500)
  const [currency, setCurrency] = useState('USD')
  const [interests, setInterests] = useState('culture, food, nature')
  const [travelStyle, setTravelStyle] = useState<
  "budget" | "comfort" | "luxury"
>("comfort")
  const [saveTrip, setSaveTrip] = useState(true)
  const [itinerary, setItinerary] = useState<string | null>(null)
  const [savedTrip, setSavedTrip] = useState<Trip | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAuthenticated = Boolean(getAccessToken())

  const formatItinerary = (payload: unknown) => {
    if (typeof payload === 'string') {
      return payload
    }

    if (payload && typeof payload === 'object') {
      return JSON.stringify(payload, null, 2)
    }

    return 'No itinerary was generated.'
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setItinerary(null)
    setSavedTrip(null)
    setIsSubmitting(true)

    try {
      const response = await generateTrip({
        destination: destination.trim(),
        country: country.trim(),
        duration_days: Number(days),
        budget,
        currency,
        interests: interests.split(',').map(item => item.trim()).filter(Boolean),
        travel_style: travelStyle,
        save_trip: saveTrip,
      })

      setItinerary(formatItinerary(response.data.itinerary))
      if (response.data.trip) {
        setSavedTrip(response.data.trip)
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to generate itinerary')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section" style={{ minHeight: '100vh', padding: '5rem 0' }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <button className="btn-ghost" onClick={() => onNavigate('home')}>
            ← Back to home
          </button>
          <h2>AI Trip Planner</h2>
          <p>Generate a custom itinerary and save it to your account. Signed-in users can store trips for later review.</p>
        </div>

        {!isAuthenticated && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: 24 }}>
            You need to sign in to generate trips and save them. Please log in or create an account.
          </div>
        )}

        <div className="card glass" style={{ padding: 24, marginBottom: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                className="auth-input"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="Tokyo, Amalfi Coast, Banff..."
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="country">Country / Region</label>
              <input
                id="country"
                className="auth-input"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="Japan, Italy, Canada..."
                required
              />
            </div>

            <div className="auth-field auth-field-row" style={{ gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="days">Duration (days)</label>
                <input
                  id="days"
                  className="auth-input"
                  type="number"
                  min={1}
                  value={days}
                  onChange={e => setDays(Number(e.target.value))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="budget">Budget</label>
                <input
                  id="budget"
                  className="auth-input"
                  type="number"
                  min={0}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="currency">Currency</label>
                <input
                  id="currency"
                  className="auth-input"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="interests">Interests</label>
              <input
                id="interests"
                className="auth-input"
                value={interests}
                onChange={e => setInterests(e.target.value)}
                placeholder="culture, food, nature"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="travelStyle">Travel Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {[
                  { value: 'budget' as const, label: 'Budget', icon: '💸', description: 'Smart savings, practical routes, and affordable stays.' },
                  { value: 'comfort' as const, label: 'Comfort', icon: '🛋️', description: 'Balanced pacing with easy transitions and great rest stops.' },
                  { value: 'luxury' as const, label: 'Luxury', icon: '✨', description: 'Elevated itineraries with premium stays, dining, and experiences.' }
                ].map(option => {
                  const isActive = travelStyle === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTravelStyle(option.value)}
                      style={{
                        textAlign: 'left',
                        borderRadius: 18,
                        padding: '16px 16px',
                        border: isActive ? '1px solid rgba(59,130,246,0.8)' : '1px solid rgba(255,255,255,0.1)',
                        background: isActive ? 'rgba(59,130,246,0.16)' : 'rgba(255,255,255,0.04)',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        boxShadow: isActive ? '0 14px 30px rgba(59,130,246,0.2)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{option.icon}</span>
                      <strong style={{ fontSize: 15 }}>{option.label}</strong>
                      <span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text2)' }}>{option.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="auth-remember" style={{ marginBottom: 16 }}>
              <label className="auth-checkbox-label">
                <input type="checkbox" checked={saveTrip} onChange={e => setSaveTrip(e.target.checked)} />
                <span className="auth-checkbox-custom" />
                Save this trip to my account
              </label>
            </div>

            {errorMessage && (
              <div className="auth-alert auth-alert-error" style={{ marginBottom: 16 }}>
                {errorMessage}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isSubmitting || !isAuthenticated}>
              {isSubmitting ? 'Generating itinerary…' : 'Generate itinerary'}
            </button>
          </form>
        </div>

        {(itinerary || savedTrip) && (
          <div className="card glass" style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h3>Generated Itinerary</h3>
              <p className="text-muted">You can review your plan here or visit your saved trips.</p>
            </div>

            {savedTrip && (
              <div className="auth-alert auth-alert-success" style={{ marginBottom: 16 }}>
                Trip saved to your account: <strong>{savedTrip.title || savedTrip.destination}</strong>
              </div>
            )}

            {itinerary && (
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7, background: 'rgba(255,255,255,0.05)', padding: 18, borderRadius: 16, overflowX: 'auto' }}>
                {itinerary}
              </pre>
            )}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
              <button className="btn-ghost" onClick={() => onNavigate('trips')}>
                View saved trips
              </button>
              <button className="btn-ghost" onClick={() => onNavigate('home')}>
                Return to home
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
