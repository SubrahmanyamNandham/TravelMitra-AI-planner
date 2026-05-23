import { type FormEvent, useEffect, useState } from 'react'
import { createTrip, deleteTrip, getAccessToken, listTrips } from '../api'
import type { Trip } from '../api'

type Page = 'home' | 'login' | 'signup' | 'ai' | 'trips'

interface Props {
  onNavigate: (page: Page) => void
}

type DetailTab = 'main' | 'itinerary' | 'json'

type ActivityBlock = {
  activity?: string
  description?: string
  location?: string
  duration?: string
  cost?: string
  tip?: string
}

type ItineraryDay = {
  day?: number | string
  theme?: string
  morning?: ActivityBlock
  afternoon?: ActivityBlock
  evening?: ActivityBlock
  transport?: string
  accommodation?: {
    name?: string
    type?: string
    estimated_cost?: string
  }
  daily_budget?: {
    amount?: number | string
    currency?: string
  }
}

type StructuredItinerary = {
  title?: string
  summary?: string
  highlights?: string[]
  estimated_total_cost?: {
    amount?: number | string
    currency?: string
  }
  best_time_to_visit?: string
  days?: ItineraryDay[]
  practical_tips?: Record<string, unknown>
}

const normalizeText = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

const formatDisplayDate = (value: string | null | undefined) => {
  if (!value) {
    return '—'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return String(value)
  }

  return parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

const formatDisplayDateRange = (startDate: string | null | undefined, endDate: string | null | undefined) => {
  if (!startDate) {
    return 'Dates not set'
  }

  const formattedStart = formatDisplayDate(startDate)
  const formattedEnd = endDate ? formatDisplayDate(endDate) : 'TBD'

  return `${formattedStart} → ${formattedEnd}`
}

const formatMoney = (amount: number | string | undefined, currency: string | undefined) => {
  if (amount === undefined || amount === null || amount === '') {
    return ''
  }

  const currencyLabel = currency || ''
  return `${currencyLabel}${currencyLabel ? ' ' : ''}${amount}`
}

const parseStructuredItinerary = (rawItinerary: unknown): StructuredItinerary | null => {
  if (rawItinerary == null) {
    return null
  }

  let parsed: unknown = rawItinerary

  if (typeof rawItinerary === 'string') {
    const trimmed = rawItinerary.trim()

    if (!trimmed) {
      return null
    }

    try {
      parsed = JSON.parse(trimmed)
    } catch {
      return null
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    return null
  }

  const record = parsed as Record<string, unknown>
  const highlights = Array.isArray(record.highlights)
    ? record.highlights.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []

  const days = Array.isArray(record.days)
    ? record.days.map((day) => {
        if (!day || typeof day !== 'object') {
          return null
        }

        const source = day as Record<string, unknown>
        return {
          day: source.day,
          theme: normalizeText(source.theme),
          morning: source.morning && typeof source.morning === 'object' ? source.morning as ActivityBlock : undefined,
          afternoon: source.afternoon && typeof source.afternoon === 'object' ? source.afternoon as ActivityBlock : undefined,
          evening: source.evening && typeof source.evening === 'object' ? source.evening as ActivityBlock : undefined,
          transport: normalizeText(source.transport),
          accommodation: source.accommodation && typeof source.accommodation === 'object' ? source.accommodation as StructuredItinerary['estimated_total_cost'] : undefined,
          daily_budget: source.daily_budget && typeof source.daily_budget === 'object' ? source.daily_budget as StructuredItinerary['estimated_total_cost'] : undefined
        }
      }).filter(Boolean)
    : []

  return {
    title: normalizeText(record.title),
    summary: normalizeText(record.summary),
    highlights,
    estimated_total_cost: record.estimated_total_cost && typeof record.estimated_total_cost === 'object'
      ? record.estimated_total_cost as StructuredItinerary['estimated_total_cost']
      : undefined,
    best_time_to_visit: normalizeText(record.best_time_to_visit),
    days: days as ItineraryDay[],
    practical_tips: record.practical_tips && typeof record.practical_tips === 'object'
      ? record.practical_tips as Record<string, unknown>
      : undefined
  }
}

const renderActivityBlock = (label: string, block?: ActivityBlock) => {
  if (!block) {
    return null
  }

  const activity = normalizeText(block.activity)
  const description = normalizeText(block.description)
  const location = normalizeText(block.location)
  const duration = normalizeText(block.duration)
  const cost = normalizeText(block.cost)
  const tip = normalizeText(block.tip)

  if (!activity && !description && !location && !duration && !cost && !tip) {
    return null
  }

  return (
    <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#f8fbff' }}>{label}</p>
      {activity && <p style={{ margin: '0 0 6px', fontWeight: 600 }}>{activity}</p>}
      {description && <p style={{ margin: '0 0 6px', color: 'rgba(248,251,255,0.86)' }}>{description}</p>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13, color: 'rgba(248,251,255,0.76)' }}>
        {location && <span>📍 {location}</span>}
        {duration && <span>⏱️ {duration}</span>}
        {cost && <span>💸 {cost}</span>}
      </div>
      {tip && <p style={{ margin: '10px 0 0', color: 'rgba(192, 238, 255, 0.92)' }}>💡 {tip}</p>}
    </div>
  )
}

export default function TripsPage({ onNavigate }: Props) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [title, setTitle] = useState('My next adventure')
  const [destination, setDestination] = useState('')
  const [country, setCountry] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState(1500)
  const [currency, setCurrency] = useState('USD')
  const [interests, setInterests] = useState('culture, food, nature')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'cards' | 'json'>('cards')
  const [activeTripTab, setActiveTripTab] = useState<DetailTab>('main')

  const isAuthenticated = Boolean(getAccessToken())

  const toApiIsoDate = (value: string) => {
    if (!value) return undefined
    return new Date(`${value}T12:00:00Z`).toISOString()
  }

  const loadTrips = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await listTrips()
      setTrips(response.data.trips || [])
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load trips')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      void loadTrips()
    }
  }, [isAuthenticated])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSaving(true)

    try {
      const response = await createTrip({
        title: title.trim(),
        destination: destination.trim(),
        country: country.trim(),
        start_date: toApiIsoDate(startDate),
        end_date: toApiIsoDate(endDate),
        budget: Number(budget),
        currency,
        interests: interests.split(',').map(item => item.trim()).filter(Boolean),
      })

      setTrips(current => [response.data.trip, ...current])
      setSuccessMessage('Trip created successfully.')
      setTitle('My next adventure')
      setDestination('')
      setCountry('')
      setStartDate('')
      setEndDate('')
      setBudget(1500)
      setInterests('culture, food, nature')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create trip')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setErrorMessage(null)
    try {
      await deleteTrip(id)
      setTrips(current => current.filter(trip => trip.id !== id))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete trip')
    }
  }

  const selectedTrip = trips.find(trip => trip.id === selectedTripId) || null

  const selectedTripPayload = selectedTrip
    ? {
        id: selectedTrip.id,
        title: selectedTrip.title,
        destination: selectedTrip.destination,
        country: selectedTrip.country,
        start_date: selectedTrip.start_date,
        end_date: selectedTrip.end_date,
        budget: selectedTrip.budget,
        currency: selectedTrip.currency,
        interests: selectedTrip.interests,
        itinerary: selectedTrip.itinerary,
        created_at: selectedTrip.created_at,
        updated_at: selectedTrip.updated_at
      }
    : null

  const selectedTripRows = selectedTrip
    ? [
        ['Title', selectedTrip.title || '—'],
        ['Destination', selectedTrip.destination || '—'],
        ['Country', selectedTrip.country || '—'],
        ['Start date', formatDisplayDate(selectedTrip.start_date)],
        ['End date', formatDisplayDate(selectedTrip.end_date)],
        ['Budget', `${selectedTrip.currency} ${selectedTrip.budget}`],
        ['Interests', selectedTrip.interests.length ? selectedTrip.interests.join(', ') : '—'],
        ['Created', formatDisplayDate(selectedTrip.created_at)],
        ['Updated', formatDisplayDate(selectedTrip.updated_at)]
      ]
    : []

  const itineraryData = selectedTrip ? parseStructuredItinerary(selectedTrip.itinerary) : null
  const rawItineraryFallback = selectedTrip?.itinerary?.trim() || ''

  return (
    <section className="section" style={{ minHeight: '100vh', padding: '5rem 0' }}>
      <div className="container" style={{ maxWidth: 1040 }}>
        <style>{`
          .trip-itinerary-overview {
            padding: 24px;
            border-radius: 28px;
            background: linear-gradient(135deg, rgba(97, 120, 255, 0.25), rgba(34, 211, 238, 0.12));
            border: 1px solid rgba(153, 176, 255, 0.22);
            box-shadow: 0 12px 40px rgba(15, 23, 42, 0.28);
          }

          .trip-itinerary-chip {
            padding: 10px 14px;
            border-radius: 999px;
            background: rgba(15, 23, 42, 0.28);
            border: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 13px;
          }

          .trip-itinerary-day {
            padding: 22px;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.24);
          }

          .trip-itinerary-tip {
            padding: 22px;
            border-radius: 24px;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(90, 118, 255, 0.08));
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .trip-card {
            padding: 20px;
            min-height: 220px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .trip-view-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .trip-view-actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
          }

          .trip-grid-responsive {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .trip-card-actions button,
          .trip-view-actions button,
          .trip-view-tab-button {
            transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
          }

          .trip-card-actions button:hover,
          .trip-view-actions button:hover,
          .trip-view-tab-button:hover {
            transform: translateY(-1px);
            border-color: rgba(148, 163, 255, 0.55);
            box-shadow: 0 10px 24px rgba(14, 165, 233, 0.14);
          }

          .trip-card-actions button:focus-visible,
          .trip-view-actions button:focus-visible,
          .trip-view-tab-button:focus-visible {
            outline: 2px solid rgba(125, 211, 252, 0.9);
            outline-offset: 2px;
          }

          @media (max-width: 1024px) {
            .trip-grid-responsive {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 768px) {
            .trip-itinerary-overview {
              padding: 18px;
              border-radius: 22px;
            }

            .trip-itinerary-overview h3 {
              font-size: 22px;
            }

            .trip-itinerary-chip {
              font-size: 12px;
              padding: 9px 12px;
            }

            .trip-itinerary-day {
              padding: 18px;
              border-radius: 20px;
            }

            .trip-itinerary-day h4 {
              font-size: 20px;
            }

            .trip-itinerary-tip {
              padding: 18px;
              border-radius: 20px;
            }

            .trip-itinerary-summary {
              font-size: 15px;
            }

            .trip-card {
              min-height: auto;
              padding: 18px;
            }

            .trip-card h4 {
              font-size: 18px;
              margin-bottom: 8px;
            }

            .trip-card .trip-card-actions {
              flex-direction: column;
              align-items: stretch;
            }

            .trip-card .trip-card-actions button {
              width: 100%;
              justify-content: center;
            }

            .trip-card pre {
              font-size: 12px;
              padding: 12px;
            }
          }
        `}</style>
        <div className="section-head" style={{ marginBottom: 24 }}>
          <button className="btn-ghost" onClick={() => onNavigate('home')}>
            ← Back to home
          </button>
          <h2>My Saved Trips</h2>
          <p>Access your past itineraries and create new plans manually or with AI.</p>
        </div>

        {!isAuthenticated && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: 24 }}>
            Sign in to see your saved trips. Your session allows secure access to trip management.
          </div>
        )}

        {errorMessage && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: 24 }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="auth-alert auth-alert-success" style={{ marginBottom: 24 }}>
            {successMessage}
          </div>
        )}

        <div className="card glass" style={{ padding: 24, marginBottom: 32 }}>
          <form onSubmit={handleCreate}>
            <div className="auth-field">
              <label htmlFor="tripTitle">Trip title</label>
              <input
                id="tripTitle"
                className="auth-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="My lagoon escape"
                required
              />
            </div>

            <div className="auth-field auth-field-row" style={{ gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="tripDestination">Destination</label>
                <input
                  id="tripDestination"
                  className="auth-input"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="Bali, Lisbon, Iceland"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="tripCountry">Country</label>
                <input
                  id="tripCountry"
                  className="auth-input"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Indonesia, Portugal, Iceland"
                  required
                />
              </div>
            </div>

            <div className="auth-field auth-field-row" style={{ gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="startDate">Start date</label>
                <input
                  id="startDate"
                  className="auth-input"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="endDate">End date</label>
                <input
                  id="endDate"
                  className="auth-input"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="tripBudget">Budget</label>
                <input
                  id="tripBudget"
                  className="auth-input"
                  type="number"
                  min={0}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="auth-field auth-field-row" style={{ gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="tripCurrency">Currency</label>
                <input
                  id="tripCurrency"
                  className="auth-input"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                />
              </div>
              <div style={{ flex: 2 }}>
                <label htmlFor="tripInterests">Interests</label>
                <input
                  id="tripInterests"
                  className="auth-input"
                  value={interests}
                  onChange={e => setInterests(e.target.value)}
                  placeholder="culture, beaches, hiking"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={isSaving || !isAuthenticated}>
              {isSaving ? 'Saving trip…' : 'Create new trip'}
            </button>
          </form>
        </div>

        <div className="trip-view-header">
          <div>
            <h3 style={{ margin: 0 }}>{activeView === 'json' ? 'Trip JSON viewer' : 'Saved trips'}</h3>
            <p className="text-muted" style={{ margin: '6px 0 0' }}>
              {activeView === 'json' ? (
                <span>
                  <span style={{ opacity: 0.8 }}>Trips</span>
                  <span style={{ margin: '0 6px' }}>›</span>
                  <span>{selectedTrip ? selectedTrip.title || selectedTrip.destination : 'JSON Viewer'}</span>
                </span>
              ) : (
                'Browse your saved trips and open any trip in the JSON viewer.'
              )}
            </p>
          </div>
          <div className="trip-view-actions">
            <button className="btn-ghost" onClick={loadTrips} disabled={isLoading || !isAuthenticated}>
              {isLoading ? 'Refreshing…' : 'Refresh list'}
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('ai')}>
              Generate with AI
            </button>
            <div style={{ display: 'inline-flex', gap: 8, borderRadius: 999, padding: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                className={activeView === 'cards' ? 'btn-primary trip-view-tab-button' : 'btn-ghost trip-view-tab-button'}
                onClick={() => setActiveView('cards')}
                style={{ padding: '8px 14px' }}
              >
                Trips
              </button>
              <button
                className={activeView === 'json' ? 'btn-primary trip-view-tab-button' : 'btn-ghost trip-view-tab-button'}
                onClick={() => setActiveView('json')}
                disabled={!selectedTrip}
                style={{ padding: '8px 14px' }}
              >
                JSON Viewer
              </button>
            </div>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="card glass" style={{ padding: 24 }}>
            <p>No saved trips yet. Generate an itinerary from the AI planner or create a trip manually.</p>
          </div>
        ) : activeView === 'json' ? (
          selectedTrip ? (
            <div className="card glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                <button
                  className={activeTripTab === 'main' ? 'btn-primary trip-view-tab-button' : 'btn-ghost trip-view-tab-button'}
                  onClick={() => setActiveTripTab('main')}
                  style={{ padding: '10px 16px' }}
                >
                  Main data
                </button>
                <button
                  className={activeTripTab === 'itinerary' ? 'btn-primary trip-view-tab-button' : 'btn-ghost trip-view-tab-button'}
                  onClick={() => setActiveTripTab('itinerary')}
                  style={{ padding: '10px 16px' }}
                >
                  Itineraries
                </button>
                <button
                  className={activeTripTab === 'json' ? 'btn-primary trip-view-tab-button' : 'btn-ghost trip-view-tab-button'}
                  onClick={() => setActiveTripTab('json')}
                  style={{ padding: '10px 16px' }}
                >
                  Generated JSON
                </button>
              </div>

              {activeTripTab === 'main' && (
                <div style={{ marginBottom: 18 }}>
                  <p className="text-muted" style={{ marginTop: 0 }}>Main data</p>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Field</th>
                          <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTripRows.map(([label, value]) => (
                          <tr key={label}>
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>{label}</td>
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{String(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTripTab === 'itinerary' && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ marginBottom: 16 }}>
                    <p className="text-muted" style={{ margin: 0 }}>Itineraries</p>
                    <p className="text-sm" style={{ margin: '6px 0 0' }}>A polished itinerary view is shown here for saved AI-generated plans.</p>
                  </div>

                  {itineraryData ? (
                    <div style={{ display: 'grid', gap: 20 }}>
                      <div className="trip-itinerary-overview">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16, flexWrap: 'wrap' }}>
                          <div>
                            <p className="text-muted" style={{ margin: '0 0 8px', letterSpacing: 0.4 }}>Overview</p>
                            <h3 style={{ margin: 0, fontSize: 26 }}>{itineraryData.title || selectedTrip?.title || 'Trip itinerary'}</h3>
                          </div>
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {itineraryData.best_time_to_visit && (
                              <span className="trip-itinerary-chip">
                                ✨ Best time: {itineraryData.best_time_to_visit}
                              </span>
                            )}
                            {itineraryData.estimated_total_cost && (
                              <span className="trip-itinerary-chip">
                                💸 {formatMoney(itineraryData.estimated_total_cost.amount, itineraryData.estimated_total_cost.currency)}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="trip-itinerary-summary" style={{ margin: '16px 0 0', color: 'rgba(248,251,255,0.92)', lineHeight: 1.7 }}>{itineraryData.summary || 'No summary was saved with this itinerary.'}</p>
                        {itineraryData.highlights?.length ? (
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                            {itineraryData.highlights.map((highlight, index) => (
                              <span key={`${highlight}-${index}`} className="trip-itinerary-chip" style={{ background: 'rgba(248,251,255,0.08)', border: '1px solid rgba(248,251,255,0.08)' }}>
                                {highlight}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      {itineraryData.days?.length ? (
                        itineraryData.days.map((day, index) => (
                          <div key={`${day.day}-${index}`} className="trip-itinerary-day">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                              <div>
                                <p className="text-muted" style={{ margin: '0 0 6px' }}>Day {day.day ?? index + 1}</p>
                                <h4 style={{ margin: 0, fontSize: 22 }}>{day.theme || 'Daily plan'}</h4>
                              </div>
                              {day.daily_budget && (
                                <span className="trip-itinerary-chip" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                  Budget: {formatMoney(day.daily_budget.amount, day.daily_budget.currency)}
                                </span>
                              )}
                            </div>

                            {renderActivityBlock('Morning', day.morning)}
                            {renderActivityBlock('Afternoon', day.afternoon)}
                            {renderActivityBlock('Evening', day.evening)}

                            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
                              {day.transport && (
                                <p style={{ margin: 0, color: 'rgba(248,251,255,0.88)' }}>🚗 {day.transport}</p>
                              )}
                              {day.accommodation && (
                                <p style={{ margin: 0, color: 'rgba(248,251,255,0.88)' }}>
                                  🏨 {day.accommodation.name || 'Accommodation'}{day.accommodation.type ? ` • ${day.accommodation.type}` : ''}{day.accommodation.estimated_cost ? ` • ${day.accommodation.estimated_cost}` : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: 20, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <p style={{ margin: 0 }}>This saved itinerary has no day-by-day entries, but the overview and highlights are still available.</p>
                        </div>
                      )}

                      {itineraryData.practical_tips && Object.keys(itineraryData.practical_tips).length > 0 && (
                        <div className="trip-itinerary-tip">
                          <p className="text-muted" style={{ margin: '0 0 12px' }}>Practical tips</p>
                          <div style={{ display: 'grid', gap: 12 }}>
                            {Object.entries(itineraryData.practical_tips).map(([key, value]) => (
                              <div key={key} style={{ padding: '14px 16px', borderRadius: 20, background: 'rgba(15, 23, 42, 0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <p style={{ margin: 0, fontWeight: 700, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</p>
                                <p style={{ margin: '6px 0 0', color: 'rgba(248,251,255,0.84)', lineHeight: 1.7 }}>{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : rawItineraryFallback ? (
                    <div className="card glass" style={{ padding: 18 }}>
                      <p style={{ margin: 0 }}>This saved itinerary is plain text. The structured view is unavailable, but the full content is still available in the Generated JSON tab.</p>
                    </div>
                  ) : (
                    <div className="card glass" style={{ padding: 18 }}>
                      <p style={{ margin: 0 }}>No structured itinerary data was saved for this trip. The plain itinerary text is still available in the Generated JSON tab.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTripTab === 'json' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <div>
                      <p className="text-muted" style={{ margin: 0 }}>Generated JSON</p>
                      <p className="text-sm" style={{ margin: '6px 0 0' }}>This view shows the saved trip as JSON for easy inspection.</p>
                    </div>
                  </div>
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: 'rgba(255,255,255,0.04)', padding: 18, borderRadius: 16, fontSize: 13, margin: 0 }}>
                    {JSON.stringify(selectedTripPayload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="card glass" style={{ padding: 24 }}>
              <p>Select a trip from the Trips tab to open its JSON viewer.</p>
            </div>
          )
        ) : (
          <div className="trip-grid-responsive">
            {trips.map(trip => (
              <div key={trip.id} className="card glass trip-card">
                <div>
                  <h4>{trip.title || trip.destination}</h4>
                  <p className="text-muted">{trip.destination}, {trip.country}</p>
                  <p className="text-sm" style={{ marginTop: 12 }}>
                    {formatDisplayDateRange(trip.start_date, trip.end_date)}
                  </p>
                  <p className="text-sm" style={{ marginTop: 6 }}>
                    Budget: {trip.currency} {trip.budget}
                  </p>
                  {trip.interests?.length ? (
                    <p className="text-sm" style={{ marginTop: 12 }}>
                      Interests: {trip.interests.join(', ')}
                    </p>
                  ) : null}
                  {trip.itinerary ? (
                    <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12, background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 14, fontSize: 13 }}>
                      {trip.itinerary.substring(0, 300)}{trip.itinerary.length > 300 ? '…' : ''}
                    </pre>
                  ) : null}
                </div>
                <div className="trip-card-actions" style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                  <button className="btn-ghost" onClick={() => handleDelete(trip.id)}>
                    Delete
                  </button>
                  <button className="btn-ghost" onClick={() => onNavigate('ai')}>
                    Replan with AI
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setSelectedTripId(trip.id)
                      setActiveView('json')
                      setActiveTripTab('main')
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
