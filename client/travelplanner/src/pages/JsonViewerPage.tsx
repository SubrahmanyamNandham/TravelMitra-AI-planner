import { useEffect, useMemo, useState } from 'react'

type TripRecord = Record<string, unknown>

type ViewMode = 'table' | 'cards'

export interface JsonViewerPageProps {
  initialTrips?: TripRecord[]
  embedded?: boolean
  title?: string
  subtitle?: string
}

const sampleTrips: TripRecord[] = [
  {
    name: 'Tokyo Cultural Escape',
    destination: 'Tokyo, Japan',
    days: 7,
    budget: { amount: 3200, currency: 'USD' },
    travelers: 2,
    accommodation: 'Boutique hotel in Shinjuku',
    transport: 'Flight + JR Pass',
    activities: ['Tea ceremony', 'Sushi making class', 'Shibuya crossing', 'Senso-ji temple', 'TeamLab digital art'],
    itinerary: [
      { title: 'Shibuya and Harajuku', description: 'Start in the fashion-forward neighborhoods for street food, boutique browsing, and a lively atmosphere.' },
      { title: 'Asakusa and Skytree', description: 'Visit historic temples, then head to Tokyo Skytree for panoramic skyline views.' },
      { title: 'Ueno and Yanaka', description: 'Explore museums, local markets, and the quieter traditional side of the city.' },
      { title: 'Ginza and TeamLab', description: 'Spend a day in the design-forward district with interactive digital art and fine dining.' },
      { title: 'Kyoto-style tea ritual', description: 'Take a calm tea ceremony class and unwind with kaiseki-style tasting.' },
      { title: 'Riverside evening', description: 'Finish with a sunset walk along the river and a dramatic night view of Tokyo.' }
    ],
    start_date: '2025-04-01',
    end_date: '2025-04-07',
    summary: 'A vibrant seven-day Tokyo journey balancing iconic landmarks, design, food, and calm traditional moments.'
  },
  {
    name: 'Amalfi Coast Romance',
    destination: 'Amalfi Coast, Italy',
    days: 5,
    budget: { amount: 4500, currency: 'EUR' },
    travelers: 2,
    accommodation: 'Cliffside villa in Positano',
    transport: 'Flight to Naples + ferry',
    activities: ['Boat tour', 'Limoncello tasting', 'Path of Gods hike', 'Pompeii ruins', 'Local cooking class'],
    itinerary: [
      { title: 'Naples to Positano', description: 'Arrive in Naples, take the ferry to Positano, and settle into the coast.' },
      { title: 'Boat day on the coast', description: 'Cruise the blue water, swim in coves, and taste local seafood.' },
      { title: 'Hiking the Path of Gods', description: 'Walk one of the most scenic trails on the coast with dramatic terraces and sea views.' },
      { title: 'Pompeii day', description: 'Discover the archaeological ruins and finish with a sunset aperitivo.' }
    ],
    start_date: '2025-06-10',
    end_date: '2025-06-14',
    summary: 'A sun-drenched coastal escape full of sea views, local flavor, and cliffside romance.'
  },
  {
    name: 'Patagonia Adventure Trek',
    destination: 'Patagonia, Chile',
    days: 12,
    budget: 2800,
    travelers: 3,
    accommodation: 'Camping + mountain refuges',
    transport: 'Flight to Punta Arenas + bus',
    activities: ['W Trek', 'Glacier hike', 'Wildlife watching', 'Kayaking', 'Photography'],
    itinerary: [
      { title: 'Punta Arenas arrival', description: 'Arrive in southern Chile and prepare for the journey into the park.' },
      { title: 'Lake access and trail start', description: 'Begin the trek with scenic views and glacier-fed lakes.' },
      { title: 'Glacier and wildlife day', description: 'Spot wildlife and explore the dramatic glacier landscapes.' },
      { title: 'Kayaking and panoramic photography', description: 'Capture the dramatic peaks and reflected water at golden hour.' }
    ],
    start_date: '2025-11-18',
    end_date: '2025-11-29',
    summary: 'A high-adrenaline Patagonia plan built around trekking, wildlife, and untouched alpine scenery.'
  }
]

const badgeClasses = ['badge-blue', 'badge-teal', 'badge-amber', 'badge-coral', 'badge-green', 'badge-gray', 'badge-purple', 'badge-pink']

const defaultViewButtons = [
  { id: 'table', label: 'Table', icon: 'ti-table' },
  { id: 'cards', label: 'Cards', icon: 'ti-layout-cards' }
] as const

function getValue(target: TripRecord | null | undefined, ...keys: string[]) {
  if (!target || typeof target !== 'object') {
    return undefined
  }
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(target, key) && target[key] !== undefined && target[key] !== null) {
      return target[key]
    }
  }
  return undefined
}

function parseNumeric(value: unknown) {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string') {
    const cleaned = Number(value.replace(/[^\d.-]/g, ''))
    if (!Number.isNaN(cleaned)) return cleaned
  }
  return null
}

function formatBudget(value: unknown) {
  if (value === undefined || value === null) return '—'
  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>
    const amount = record.amount ?? record.total ?? record.price ?? record.cost
    const currency = (record.currency as string) || (record.code as string) || ''
    const prefix = currency ? `${currency} ` : ''
    if (typeof amount === 'number') return `${prefix}${amount.toLocaleString()}`
    if (typeof amount === 'string') return `${prefix}${amount}`
  }
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'string') return value
  return '—'
}

function formatDate(value: unknown) {
  if (!value) return '—'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function toArray(value: unknown) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.split(',').map(item => item.trim()).filter(Boolean)
  return []
}

function stringifyValue(value: unknown) {
  if (value === undefined || value === null) return '—'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    return value.length > 2 ? `${value.slice(0, 2).join(', ')}, ...` : value.join(', ')
  }
  if (typeof value === 'object') return JSON.stringify(value).slice(0, 40)
  return String(value)
}

function normalizePayload(raw: unknown) {
  if (Array.isArray(raw)) return raw as TripRecord[]
  if (raw && typeof raw === 'object') {
    const record = raw as TripRecord
    if (Array.isArray(record.trips)) return record.trips as TripRecord[]
    if (Array.isArray(record.data)) return record.data as TripRecord[]
    return [record]
  }
  return []
}

function inferColumns(items: TripRecord[]) {
  const priority = ['name', 'destination', 'days', 'budget', 'start_date', 'travelers', 'accommodation', 'transport']
  const allKeys = new Set<string>()
  items.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key))
  })
  const selected = priority.filter(key => allKeys.has(key))
  if (selected.length >= 4) return selected
  return [...allKeys].slice(0, 6)
}

function computeStats(items: TripRecord[]) {
  const durations: number[] = []
  const budgets: number[] = []
  const destinations = new Set<string>()

  items.forEach(item => {
    const destination = String(getValue(item, 'destination', 'dest', 'location', 'city', 'country', 'place', 'to', 'where') ?? '')
    if (destination) destinations.add(destination)

    const days = getValue(item, 'days', 'duration', 'nights', 'duration_days', 'numDays', 'num_days', 'length')
    const numericDays = parseNumeric(days)
    if (numericDays !== null) durations.push(numericDays)

    const budget = getValue(item, 'budget', 'cost', 'price', 'total_cost')
    const budgetValue = typeof budget === 'object' && budget !== null ? parseNumeric((budget as Record<string, unknown>).amount) : parseNumeric(budget)
    if (budgetValue !== null) budgets.push(Number(budgetValue))
  })

  return {
    totalTrips: items.length,
    uniqueDestinations: destinations.size,
    avgDuration: durations.length ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length) : 0,
    totalBudget: budgets.length ? Math.round(budgets.reduce((sum, value) => sum + value, 0)) : null
  }
}

function getTripName(item: TripRecord, index: number) {
  return String(getValue(item, 'name', 'title', 'trip_name', 'tripName', 'trip', 'label') ?? `Trip ${index + 1}`)
}

function getDestination(item: TripRecord) {
  return String(getValue(item, 'destination', 'dest', 'location', 'city', 'country', 'place', 'to', 'where') ?? 'Unknown')
}

function getSummary(item: TripRecord) {
  return String(getValue(item, 'summary', 'description', 'notes', 'overview', 'ai_summary', 'aiSummary') ?? '')
}

function getItinerary(item: TripRecord) {
  return getValue(item, 'itinerary', 'schedule', 'days', 'dayByDay', 'day_by_day')
}

function getActivityTags(item: TripRecord) {
  return toArray(getValue(item, 'activities', 'interests', 'highlights', 'tags', 'themes', 'categories')).slice(0, 6)
}

function getModalFields(item: TripRecord) {
  const displayed = new Set([
    'name', 'title', 'trip_name', 'tripName', 'trip', 'label',
    'destination', 'dest', 'location', 'city', 'country', 'place', 'to', 'where',
    'days', 'duration', 'nights', 'duration_days', 'numDays', 'num_days', 'length',
    'budget', 'cost', 'price', 'total_cost',
    'start_date', 'startDate', 'from', 'departure', 'end_date', 'endDate', 'to_date', 'return',
    'travelers', 'people', 'guests', 'pax', 'num_travelers',
    'accommodation', 'hotel', 'stay', 'lodging',
    'transport', 'transportation', 'travel_by', 'mode',
    'activities', 'interests', 'highlights', 'tags', 'themes', 'categories',
    'itinerary', 'schedule', 'days', 'dayByDay', 'day_by_day',
    'summary', 'description', 'notes', 'overview', 'ai_summary', 'aiSummary'
  ])

  return Object.entries(item)
    .filter(([key]) => !displayed.has(key))
    .slice(0, 8)
}

const appStyles = `
  .json-viewer-page {
    min-height: 100vh;
    padding: 34px 18px 48px;
  }

  .viewer-shell {
    max-width: 1160px;
    margin: 0 auto;
  }

  .viewer-topbar {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    margin-bottom: 16px;
  }

  .viewer-heading h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
  }

  .viewer-heading p {
    margin: 6px 0 0;
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .viewer-panel {
    background: var(--color-background-primary);
    border: 0.5px solid var(--color-border-tertiary);
    border-radius: 16px;
    padding: 16px;
  }

  .viewer-panel-header {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: space-between;
    align-items: end;
    margin-bottom: 12px;
  }

  .panel-copy {
    margin: 4px 0 0;
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .input-textarea {
    width: 100%;
    min-height: 240px;
    border-radius: 8px;
    border: 0.5px solid var(--color-border-tertiary);
    background: var(--color-background-secondary);
    color: var(--color-text-primary);
    padding: 14px;
    resize: vertical;
    outline: none;
  }

  .input-textarea:focus {
    border-color: var(--color-border-primary);
  }

  .button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 12px;
  }

  .action-btn {
    border-radius: 999px;
    border: 0.5px solid var(--color-border-secondary);
    background: transparent;
    color: var(--color-text-primary);
    padding: 10px 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;
  }

  .action-btn:hover { background: var(--color-background-secondary); }
  .action-btn:active { transform: scale(0.98); }

  .primary-action {
    background: var(--color-text-primary);
    color: var(--color-background-primary);
    border-color: var(--color-text-primary);
  }

  .primary-action:hover { background: #222; }

  .error-bar {
    margin-top: 12px;
    padding: 12px 14px;
    border-radius: 8px;
    background: var(--color-background-danger);
    color: var(--color-text-danger);
    border: 0.5px solid var(--color-border-tertiary);
    display: none;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .error-bar.show {
    display: flex;
  }

  .results-section {
    margin-top: 20px;
    display: none;
  }

  .results-section.visible {
    display: block;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-bottom: 18px;
  }

  .metric-card {
    background: var(--color-background-secondary);
    border-radius: 8px;
    padding: 12px 14px;
  }

  .metric-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--color-text-tertiary);
    margin-bottom: 6px;
  }

  .metric-value {
    font-size: 22px;
    font-weight: 500;
  }

  .metric-meta {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 4px;
  }

  .table-wrap {
    overflow-x: auto;
    background: var(--color-background-primary);
    border: 0.5px solid var(--color-border-tertiary);
    border-radius: 16px;
  }

  .table-view table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .table-view th, .table-view td {
    padding: 12px 14px;
    text-align: left;
    border-bottom: 0.5px solid var(--color-border-tertiary);
    vertical-align: top;
  }

  .table-view th {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--color-text-tertiary);
    background: var(--color-background-secondary);
    font-weight: 500;
  }

  .table-view tbody tr {
    cursor: pointer;
    transition: background 0.1s ease;
  }

  .table-view tbody tr:hover {
    background: var(--color-background-secondary);
  }

  .badge-row {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }

  .badge-blue { background: #E6F1FB; color: #0C447C; }
  .badge-teal { background: #E1F5EE; color: #085041; }
  .badge-amber { background: #FAEEDA; color: #633806; }
  .badge-coral { background: #FAECE7; color: #712B13; }
  .badge-green { background: #EAF3DE; color: #27500A; }
  .badge-gray { background: #F1EFE8; color: #444441; }
  .badge-purple { background: #F2EBFB; color: #3F1E6E; }
  .badge-pink { background: #FCEBF1; color: #6D1A3A; }

  .ellipsis {
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  .cell-muted { color: var(--color-text-secondary); }

  .view-btn-cell {
    border: 0.5px solid var(--color-border-tertiary);
    background: transparent;
    border-radius: 999px;
    padding: 6px 10px;
    cursor: pointer;
    color: var(--color-text-primary);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px;
  }

  .trip-card {
    background: var(--color-background-primary);
    border: 0.5px solid var(--color-border-tertiary);
    border-radius: 16px;
    padding: 16px;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.1s ease;
  }

  .trip-card:hover {
    border-color: var(--color-border-primary);
    transform: translateY(-1px);
  }

  .trip-icon {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: var(--color-background-secondary);
    font-size: 20px;
    margin-bottom: 12px;
  }

  .trip-title {
    margin: 0 0 4px;
    font-size: 15px;
    font-weight: 500;
  }

  .trip-destination {
    margin-bottom: 10px;
    font-size: 13px;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .trip-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .trip-budget {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(17, 17, 17, 0.24);
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 100;
  }

  .modal-backdrop.open {
    display: flex;
  }

  .modal-card {
    width: min(860px, 100%);
    max-height: 92vh;
    overflow: auto;
    background: var(--color-background-primary);
    border: 0.5px solid var(--color-border-tertiary);
    border-radius: 20px;
    padding: 18px;
    position: relative;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: start;
    margin-bottom: 18px;
  }

  .modal-hero {
    display: flex;
    gap: 12px;
    align-items: start;
  }

  .modal-icon {
    width: 48px;
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: var(--color-background-secondary);
    font-size: 22px;
  }

  .modal-title {
    margin: 0;
    font-size: 22px;
    font-weight: 500;
  }

  .modal-subtitle {
    margin: 6px 0 0;
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .close-btn {
    border: 0;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover { background: var(--color-background-secondary); }

  .modal-body {
    display: grid;
    gap: 18px;
  }

  .modal-section {
    background: var(--color-background-secondary);
    border: 0.5px solid var(--color-border-tertiary);
    border-radius: 16px;
    padding: 16px;
  }

  .section-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--color-text-tertiary);
    margin-bottom: 12px;
    font-weight: 500;
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }

  .overview-item {
    background: var(--color-background-primary);
    border: 0.5px solid var(--color-border-tertiary);
    border-radius: 8px;
    padding: 12px;
  }

  .overview-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--color-text-tertiary);
    margin-bottom: 6px;
  }

  .overview-value {
    font-size: 14px;
    font-weight: 500;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 999px;
    background: var(--color-background-primary);
    border: 0.5px solid var(--color-border-tertiary);
    color: var(--color-text-secondary);
    font-size: 13px;
  }

  .itinerary-list {
    display: grid;
    gap: 12px;
  }

  .itinerary-row {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 12px;
  }

  .itinerary-index {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background-primary);
    border: 0.5px solid var(--color-border-tertiary);
    font-size: 12px;
    font-weight: 600;
  }

  .itinerary-title {
    margin-bottom: 4px;
    font-weight: 500;
    font-size: 14px;
  }

  .itinerary-body {
    color: var(--color-text-secondary);
    font-size: 13px;
    line-height: 1.5;
  }

  .extra-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }

  .extra-card {
    background: var(--color-background-primary);
    border: 0.5px solid var(--color-border-tertiary);
    border-radius: 8px;
    padding: 12px;
  }

  .extra-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--color-text-tertiary);
    margin-bottom: 6px;
  }

  .extra-value {
    font-size: 14px;
    word-break: break-word;
  }

  .ai-section {
    background: var(--color-background-info);
    border-radius: 16px;
    padding: 16px;
    border: 0.5px solid var(--color-border-tertiary);
    color: var(--color-text-info);
  }

  .ai-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .ai-copy {
    margin: 0;
    line-height: 1.6;
    font-size: 14px;
  }

  .dot-pulse {
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.35;
    animation: pulse 1s infinite ease-in-out;
  }

  .dot:nth-child(2) { animation-delay: 0.18s; }
  .dot:nth-child(3) { animation-delay: 0.32s; }

  @keyframes pulse {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.35; }
    50% { transform: scale(1.1); opacity: 1; }
  }

  .hidden {
    display: none !important;
  }

  @media (max-width: 760px) {
    .viewer-topbar {
      flex-direction: column;
      align-items: stretch;
    }
  }
`

export default function JsonViewerPage({
  initialTrips = sampleTrips,
  embedded = false,
  title = 'AI Trip Planner JSON Viewer',
  subtitle = 'Explore rich trip data with a fast table view, responsive cards, and a detailed modal experience.'
}: JsonViewerPageProps) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(initialTrips, null, 2))
  const [trips, setTrips] = useState<TripRecord[]>(initialTrips)
  const [parsed, setParsed] = useState(initialTrips.length > 0)
  const [view, setView] = useState<ViewMode>('table')
  const [error, setError] = useState<string | null>(null)
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null)
  const [aiInsight, setAiInsight] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiVisible, setAiVisible] = useState(false)

  useEffect(() => {
    setTrips(initialTrips)
    setJsonInput(JSON.stringify(initialTrips, null, 2))
    setParsed(initialTrips.length > 0)
  }, [initialTrips])

  useEffect(() => {
    if (!error) return
    const timer = window.setTimeout(() => setError(null), 4000)
    return () => window.clearTimeout(timer)
  }, [error])

  useEffect(() => {
    document.body.style.overflow = selectedTrip ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedTrip])

  useEffect(() => {
    if (!selectedTrip) {
      setAiInsight('')
      setAiLoading(false)
      setAiVisible(false)
      return
    }

    const summary = getSummary(selectedTrip)
    if (summary) {
      setAiInsight(summary)
      setAiLoading(false)
      setAiVisible(true)
      return
    }

    const apiKey = (window as Window & { __ANTHROPIC_API_KEY__?: string }).__ANTHROPIC_API_KEY__ || new URLSearchParams(window.location.search).get('anthropic_key')
    if (!apiKey) {
      setAiVisible(false)
      setAiLoading(false)
      return
    }

    setAiLoading(true)
    setAiVisible(true)

    const controller = new AbortController()

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: `You are an expert travel advisor. Given this trip data: ${JSON.stringify(selectedTrip)}. Write a vivid, enthusiastic 2-3 sentence travel insight. Highlight what makes it special, best time advice, and one must-do activity. Be warm and inspiring. Keep it concise.` }]
      })
    })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error('API error')
        const text = (data.content || []).map((item: Record<string, unknown>) => String(item.text || '')).join('')
        if (text) {
          setAiInsight(text)
        } else {
          setAiVisible(false)
        }
      })
      .catch(() => {
        setAiVisible(false)
      })
      .finally(() => {
        setAiLoading(false)
      })

    return () => controller.abort()
  }, [selectedTrip])

  const stats = useMemo(() => computeStats(trips), [trips])
  const columns = useMemo(() => inferColumns(trips), [trips])

  const parseInput = () => {
    const trimmed = jsonInput.trim()
    if (!trimmed) {
      setError('Please paste JSON or load the sample trips.')
      return
    }

    try {
      const parsedJson = JSON.parse(trimmed)
      const normalized = normalizePayload(parsedJson)
      if (!normalized.length) {
        setError('No trips were found in the JSON payload.')
        return
      }
      setTrips(normalized)
      setParsed(true)
      setView('table')
      setError(null)
    } catch {
      setError('Invalid JSON. Please check the pasted content and try again.')
    }
  }

  const loadSample = () => {
    setJsonInput(JSON.stringify(sampleTrips, null, 2))
    setTrips(sampleTrips)
    setParsed(true)
    setView('table')
    setError(null)
  }

  const clearInput = () => {
    setJsonInput('')
    setTrips([])
    setParsed(false)
    setError(null)
  }

  const openModal = (trip: TripRecord) => {
    setSelectedTrip(trip)
  }

  const closeModal = () => {
    setSelectedTrip(null)
  }

  const modalIndex = selectedTrip ? trips.findIndex(item => item === selectedTrip) : -1

  return (
    <div className="json-viewer-page" style={{ minHeight: embedded ? 'auto' : '100vh', padding: embedded ? 0 : undefined }}>
      <style>{appStyles}</style>
      <div className="viewer-shell">
        <div className="viewer-topbar">
          <div className="viewer-heading">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="view-switcher" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: 6, borderRadius: 999, background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            {defaultViewButtons.map(item => (
              <button
                key={item.id}
                className={`action-btn ${view === item.id ? 'primary-action' : ''}`}
                onClick={() => setView(item.id)}
                style={{ borderRadius: 999, padding: '8px 12px' }}
              >
                <i className={item.icon} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {!embedded && (
          <section className="viewer-panel">
            <div className="viewer-panel-header">
              <div>
                <div style={{ fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: 500 }}>Trip planner JSON</div>
                <p className="panel-copy">Paste a single trip, an array, or a wrapped object like <strong>{'{"trips": [...]}'}</strong>.</p>
              </div>
            </div>

            <textarea className="input-textarea" value={jsonInput} onChange={event => setJsonInput(event.target.value)} spellCheck={false} />

            <div className="button-row">
              <button className="action-btn" onClick={loadSample}>
                <i className="ti ti-wand" aria-hidden="true" />
                <span>Load Sample</span>
              </button>
              <button className="action-btn" onClick={clearInput}>
                <i className="ti ti-trash" aria-hidden="true" />
                <span>Clear</span>
              </button>
              <button className="action-btn primary-action" onClick={parseInput}>
                <i className="ti ti-braces" aria-hidden="true" />
                <span>Visualize My Trips</span>
              </button>
            </div>

            <div className={`error-bar ${error ? 'show' : ''}`} role="alert">{error}</div>
          </section>
        )}

        <section className={`results-section ${parsed ? 'visible' : ''}`}>
          <div className="stats-row">
            <div className="metric-card">
              <div className="metric-label">Total Trips</div>
              <div className="metric-value">{stats.totalTrips}</div>
              <div className="metric-meta">Parsed trip records</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Unique Destinations</div>
              <div className="metric-value">{stats.uniqueDestinations}</div>
              <div className="metric-meta">Distinct locations</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Avg Duration</div>
              <div className="metric-value">{stats.avgDuration} days</div>
              <div className="metric-meta">Average across trips</div>
            </div>
            {stats.totalBudget !== null && (
              <div className="metric-card">
                <div className="metric-label">Total Budget</div>
                <div className="metric-value">{stats.totalBudget.toLocaleString()}</div>
                <div className="metric-meta">Budget data detected</div>
              </div>
            )}
          </div>

          {view === 'table' ? (
            <div className="table-view">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      {columns.map(column => (
                        <th key={column}>{column.replace(/_/g, ' ')}</th>
                      ))}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip, index) => {
                      const rowName = getTripName(trip, index)
                      return (
                        <tr key={`${rowName}-${index}`} onClick={() => openModal(trip)}>
                          <td>
                            <span className={`badge-row ${badgeClasses[index % badgeClasses.length]}`}>{index + 1}</span>
                          </td>
                          {columns.map(column => {
                            const value = getValue(trip, column)
                            let display = ''
                            if (column === 'budget') {
                              display = formatBudget(value)
                            } else if (Array.isArray(value)) {
                              display = value.length > 2 ? `${value.slice(0, 2).join(', ')}, ...` : value.join(', ')
                            } else if (value && typeof value === 'object') {
                              display = JSON.stringify(value).slice(0, 40)
                            } else {
                              display = stringifyValue(value)
                            }
                            return (
                              <td key={column} className={column === 'name' || column === 'title' ? 'ellipsis' : display === '—' ? 'cell-muted' : ''}>
                                {display}
                              </td>
                            )
                          })}
                          <td>
                            <button className="view-btn-cell" onClick={event => { event.stopPropagation(); openModal(trip) }}>
                              <i className="ti ti-eye" aria-hidden="true" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="cards-grid">
              {trips.map((trip, index) => {
                const destination = getDestination(trip)
                const days = getValue(trip, 'days', 'duration', 'nights', 'duration_days', 'numDays', 'num_days', 'length')
                const travelers = getValue(trip, 'travelers', 'people', 'guests', 'pax', 'num_travelers')
                const transport = getValue(trip, 'transport', 'transportation', 'travel_by', 'mode')
                return (
                  <div key={`${getTripName(trip, index)}-${index}`} className="trip-card" onClick={() => openModal(trip)}>
                    <div className="trip-icon">{['✈️', '🏝️', '⛰️', '🌍', '🎭'][index % 5]}</div>
                    <h3 className="trip-title">{getTripName(trip, index)}</h3>
                    <div className="trip-destination">
                      <i className="ti ti-map-pin" aria-hidden="true" />
                      <span>{destination}</span>
                    </div>
                    <div className="trip-meta-row">
                      <span className="pill"><i className="ti ti-calendar" aria-hidden="true" /><span>{String(days ?? '—')} days</span></span>
                      <span className="pill"><i className="ti ti-users" aria-hidden="true" /><span>{String(travelers ?? '—')} travelers</span></span>
                      <span className="pill"><i className="ti ti-plane" aria-hidden="true" /><span>{String(transport ?? '—')}</span></span>
                    </div>
                    <div className="trip-budget">Budget: {formatBudget(getValue(trip, 'budget', 'cost', 'price', 'total_cost'))}</div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      <div className={`modal-backdrop ${selectedTrip ? 'open' : ''}`} onClick={event => { if (event.target === event.currentTarget) closeModal() }}>
        <div className="modal-card" role="dialog" aria-modal="true">
          <div className="modal-header">
            <div className="modal-hero">
              <div className="modal-icon">{['✈️', '🏝️', '⛰️', '🌍', '🎭'][modalIndex >= 0 ? modalIndex % 5 : 0]}</div>
              <div>
                <h2 className="modal-title">{selectedTrip ? getTripName(selectedTrip, modalIndex) : ''}</h2>
                <p className="modal-subtitle">
                  {selectedTrip ? `${getDestination(selectedTrip)} • ${String(getValue(selectedTrip, 'days', 'duration', 'nights', 'duration_days', 'numDays', 'num_days', 'length') ?? '—')} days • ${String(getValue(selectedTrip, 'travelers', 'people', 'guests', 'pax', 'num_travelers') ?? '—')} travelers` : ''}
                </p>
              </div>
            </div>
            <button className="close-btn" aria-label="Close" onClick={closeModal}>
              <i className="ti ti-x" aria-hidden="true" />
            </button>
          </div>

          {selectedTrip && (
            <div className="modal-body">
              <div className="modal-section">
                <div className="section-label">Overview</div>
                <div className="overview-grid">
                  {[['Start date', formatDate(getValue(selectedTrip, 'start_date', 'startDate', 'from', 'departure'))], ['End date', formatDate(getValue(selectedTrip, 'end_date', 'endDate', 'to_date', 'return'))], ['Budget', formatBudget(getValue(selectedTrip, 'budget', 'cost', 'price', 'total_cost'))], ['Accommodation', String(getValue(selectedTrip, 'accommodation', 'hotel', 'stay', 'lodging') ?? '—')], ['Transport', String(getValue(selectedTrip, 'transport', 'transportation', 'travel_by', 'mode') ?? '—')]].map(([label, value]) => (
                    <div className="overview-item" key={String(label)}>
                      <div className="overview-label">{label}</div>
                      <div className="overview-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <div className="section-label">Activities & interests</div>
                <div className="tag-list">
                  {getActivityTags(selectedTrip).length ? getActivityTags(selectedTrip).map(tag => (
                    <span className="tag-pill" key={tag}>
                      <i className="ti ti-sparkles" aria-hidden="true" />
                      <span>{tag}</span>
                    </span>
                  )) : (
                    <span className="tag-pill">
                      <i className="ti ti-sparkles" aria-hidden="true" />
                      <span>No tags available</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <div className="section-label">Itinerary</div>
                <div className="itinerary-list">
                  {Array.isArray(getItinerary(selectedTrip)) && (getItinerary(selectedTrip) as unknown[]).length ? (getItinerary(selectedTrip) as unknown[]).slice(0, 7).map((entry, index) => {
                    const current = entry as TripRecord
                    return (
                      <div className="itinerary-row" key={`${index}-${String(getValue(current, 'title', 'day', 'name') ?? 'entry')}`}>
                        <div className="itinerary-index">{index + 1}</div>
                        <div>
                          <div className="itinerary-title">{String(getValue(current, 'title', 'day', 'name') ?? `Day ${index + 1}`)}</div>
                          <div className="itinerary-body">{String(getValue(current, 'description', 'details', 'summary') ?? stringifyValue(current))}</div>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="itinerary-body">No itinerary details are available for this trip.</div>
                  )}
                  {Array.isArray(getItinerary(selectedTrip)) && (getItinerary(selectedTrip) as unknown[]).length > 7 && (
                    <div className="itinerary-body">+{(getItinerary(selectedTrip) as unknown[]).length - 7} more days</div>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <div className="section-label">Extra fields</div>
                <div className="extra-grid">
                  {getModalFields(selectedTrip).map(([key, value]) => (
                    <div className="extra-card" key={key}>
                      <div className="extra-label">{key.replace(/_/g, ' ')}</div>
                      <div className="extra-value">{stringifyValue(value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`ai-section ${aiVisible ? '' : 'hidden'}`}>
                <div className="ai-title">
                  <i className="ti ti-robot" aria-hidden="true" />
                  <span>AI Travel Insight</span>
                  {aiLoading && (
                    <span className="dot-pulse">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </span>
                  )}
                </div>
                <p className="ai-copy">{aiLoading ? 'generating travel insight...' : aiInsight}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
