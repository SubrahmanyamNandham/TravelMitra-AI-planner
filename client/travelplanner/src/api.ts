const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
const ACCESS_TOKEN_STORAGE_KEY = 'travelio_access_token'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  role: string
  isVerified: boolean
  isActive: boolean
  createdAt: string
}

interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: UserProfile
    access_token: string
    token_type: string
    expires_in: number
  }
}

async function request<T>(path: string, method: string, body?: unknown, retry = true): Promise<T> {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include'
  })

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return request<T>(path, method, body, false)
    }
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed')
  }

  return payload as T
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

function parseInterests(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      }
    } catch {
      // ignore malformed JSON and fall back to a split string
    }

    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeTrip(raw: Partial<Trip> | null | undefined): Trip {
  return {
    id: String(raw?.id ?? ''),
    title: String(raw?.title ?? ''),
    destination: String(raw?.destination ?? ''),
    country: String(raw?.country ?? ''),
    start_date: (raw?.start_date ?? (raw as { startDate?: string | null })?.startDate ?? null) as string | null,
    end_date: (raw?.end_date ?? (raw as { endDate?: string | null })?.endDate ?? null) as string | null,
    budget: Number(raw?.budget ?? 0),
    currency: String(raw?.currency ?? 'USD'),
    interests: parseInterests(raw?.interests),
    itinerary: raw?.itinerary as Trip['itinerary'],
    created_at: String((raw as { createdAt?: string | null })?.createdAt ?? raw?.created_at ?? ''),
    updated_at: String((raw as { updatedAt?: string | null })?.updatedAt ?? raw?.updated_at ?? '')
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    const payload = await request<AuthResponse>('/api/auth/refresh', 'POST', undefined, false)
    if (payload?.data?.access_token) {
      setAccessToken(payload.data.access_token)
      return true
    }
  } catch {
    clearAccessToken()
  }
  return false
}

export async function login(email: string, password: string): Promise<UserProfile> {
  const response = await request<AuthResponse>('/api/auth/login', 'POST', { email, password })
  if (!response.data) {
    throw new Error('Invalid login response')
  }
  setAccessToken(response.data.access_token)
  return response.data.user
}

export async function signup(full_name: string, email: string, password: string): Promise<UserProfile> {
  const response = await request<AuthResponse>('/api/auth/signup', 'POST', { full_name, email, password })
  if (!response.data) {
    throw new Error('Invalid signup response')
  }
  setAccessToken(response.data.access_token)
  return response.data.user
}

export async function logout(): Promise<void> {
  await request('/api/auth/logout', 'POST')
  clearAccessToken()
}

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await request<{ data: { user: UserProfile } }>('/api/auth/me', 'GET')
  return response.data.user
}

export interface Trip {
  id: string
  title: string
  destination: string
  country: string
  start_date: string | null
  end_date: string | null
  budget: number
  currency: string
  interests: string[]
  itinerary?: string
  created_at: string
  updated_at: string
}

export interface GenerateTripRequest {
  destination: string
  country: string
  duration_days: number
  budget: number
  currency: string
  interests: string[]
  travel_style: string
  save_trip: boolean
}

export async function generateTrip(data: GenerateTripRequest) {
  return await request<{ data: { itinerary: unknown; trip?: Trip } }>('/api/ai/trips/generate', 'POST', data)
}

export async function listTrips() {
  const response = await request<{ data: { trips: Trip[] } }>('/api/trips', 'GET')
  return {
    data: {
      trips: response.data.trips.map(normalizeTrip)
    }
  }
}

export async function createTrip(payload: {
  title: string
  destination: string
  country: string
  start_date?: string
  end_date?: string
  budget: number
  currency: string
  interests: string[]
}) {
  const response = await request<{ data: Trip | { trip: Trip } }>('/api/trips', 'POST', payload)
  const trip = normalizeTrip('trip' in response.data ? response.data.trip : response.data)

  return { data: { trip } } as { data: { trip: Trip } }
}

export async function deleteTrip(id: string) {
  return await request<{ message?: string }>(`/api/trips/${id}`, 'DELETE')
}
