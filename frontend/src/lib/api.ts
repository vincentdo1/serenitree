import type {
  AuthResponse,
  MeResponse,
  PlantProgress,
  Quest,
  QuestActionResponse,
  QuestIdea,
  RecapResponse,
  Reflection,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
const TOKEN_KEY = 'serenitree_token'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  if (typeof window !== 'undefined') window.localStorage.removeItem(TOKEN_KEY)
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Could not reach the server. Is the backend running?', 0)
  }

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError((data as { error?: string })?.error ?? 'Request failed', res.status)
  }
  return data as T
}

export const api = {
  auth: {
    register: (input: { username: string; email: string; password: string }) =>
      request<AuthResponse>('/api/auth/register', { method: 'POST', body: input, auth: false }),
    login: (input: { identifier: string; password: string }) =>
      request<AuthResponse>('/api/auth/login', { method: 'POST', body: input, auth: false }),
    me: () => request<MeResponse>('/api/auth/me'),
  },
  plant: {
    get: () => request<PlantProgress>('/api/plant'),
  },
  quests: {
    list: () => request<Quest[]>('/api/quests'),
    get: (id: string) => request<Quest>(`/api/quests/${id}`),
    create: (input: {
      title: string
      description?: string
      category?: string
      difficulty: string
      dueDate?: string
    }) => request<Quest>('/api/quests', { method: 'POST', body: input }),
    update: (
      id: string,
      input: Partial<{
        title: string
        description: string
        category: string | null
        difficulty: string
        dueDate: string | null
      }>,
    ) => request<Quest>(`/api/quests/${id}`, { method: 'PATCH', body: input }),
    remove: (id: string) => request<void>(`/api/quests/${id}`, { method: 'DELETE' }),
    complete: (id: string) =>
      request<QuestActionResponse>(`/api/quests/${id}/complete`, { method: 'POST' }),
    uncomplete: (id: string) =>
      request<QuestActionResponse>(`/api/quests/${id}/uncomplete`, { method: 'POST' }),
  },
  reflections: {
    list: (questId?: string) =>
      request<Reflection[]>(`/api/reflections${questId ? `?questId=${questId}` : ''}`),
    create: (input: { message: string; questId?: string }) =>
      request<Reflection>('/api/reflections', { method: 'POST', body: input }),
    remove: (id: string) => request<void>(`/api/reflections/${id}`, { method: 'DELETE' }),
  },
  insights: {
    status: () => request<{ enabled: boolean; provider: string }>('/api/insights/status', { auth: false }),
    reflectionPrompt: (questTitle?: string) =>
      request<{ prompt: string; source: 'llm' | 'local' }>('/api/insights/reflection-prompt', {
        method: 'POST',
        body: { questTitle },
      }),
    questIdeas: (theme: string) =>
      request<{ ideas: QuestIdea[]; source: 'llm' | 'local' }>('/api/insights/quest-ideas', {
        method: 'POST',
        body: { theme },
      }),
    weeklyRecap: () => request<RecapResponse>('/api/insights/weekly-recap'),
  },
}
