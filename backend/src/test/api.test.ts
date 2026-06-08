// End-to-end API tests against the real Hono app. The in-memory DB / stub LLM
// env is set in vitest.config.ts (must apply before imports — see that file).
import { beforeAll, describe, expect, it } from 'vitest'
import app from '../app'
import { runMigrations } from '../db'

beforeAll(async () => {
  await runMigrations()
})

const json = (body: unknown) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

async function register(username: string) {
  const res = await app.request(
    '/api/auth/register',
    json({ username, email: `${username}@test.dev`, password: 'password123' }),
  )
  expect(res.status).toBe(201)
  const data = (await res.json()) as { token: string; user: { id: string } }
  return data
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

describe('auth', () => {
  it('registers, rejects duplicates, logs in, and reads the profile', async () => {
    const { token } = await register('alice')

    // duplicate username -> 409
    const dup = await app.request(
      '/api/auth/register',
      json({ username: 'alice', email: 'other@test.dev', password: 'password123' }),
    )
    expect(dup.status).toBe(409)

    // login works
    const login = await app.request('/api/auth/login', json({ identifier: 'alice', password: 'password123' }))
    expect(login.status).toBe(200)

    // wrong password -> 401
    const bad = await app.request('/api/auth/login', json({ identifier: 'alice', password: 'nope' }))
    expect(bad.status).toBe(401)

    // /me returns a level-1 seedling
    const me = await app.request('/api/auth/me', { headers: auth(token) })
    expect(me.status).toBe(200)
    const meData = (await me.json()) as { plant: { level: number; stage: string } }
    expect(meData.plant.level).toBe(1)
    expect(meData.plant.stage).toBe('seedling')
  })

  it('rejects protected routes without a token', async () => {
    const res = await app.request('/api/quests')
    expect(res.status).toBe(401)
  })

  it('validates the registration body', async () => {
    const res = await app.request('/api/auth/register', json({ username: 'x', email: 'bad', password: '123' }))
    expect(res.status).toBe(400)
  })
})

describe('quests + tree growth', () => {
  it('creates a quest, completes it, grows the tree, and is idempotent', async () => {
    const { token } = await register('bob')

    // create a Dragon quest (100 XP)
    const created = await app.request('/api/quests', {
      ...json({ title: 'Launch the app', difficulty: 'Dragon' }),
      headers: { 'Content-Type': 'application/json', ...auth(token) },
    })
    expect(created.status).toBe(201)
    const quest = (await created.json()) as { id: string; xpReward: number; completed: boolean }
    expect(quest.xpReward).toBe(100)
    expect(quest.completed).toBe(false)

    // complete it -> exp 100 -> level 2 -> sapling
    const completed = await app.request(`/api/quests/${quest.id}/complete`, { method: 'POST', headers: auth(token) })
    expect(completed.status).toBe(200)
    const c1 = (await completed.json()) as { plant: { exp: number; level: number; stage: string } }
    expect(c1.plant.exp).toBe(100)
    expect(c1.plant.level).toBe(2)
    expect(c1.plant.stage).toBe('sapling')

    // completing again is idempotent (no double XP)
    const again = await app.request(`/api/quests/${quest.id}/complete`, { method: 'POST', headers: auth(token) })
    const c2 = (await again.json()) as { plant: { exp: number } }
    expect(c2.plant.exp).toBe(100)

    // uncomplete -> exp back to 0 -> seedling
    const undone = await app.request(`/api/quests/${quest.id}/uncomplete`, { method: 'POST', headers: auth(token) })
    const c3 = (await undone.json()) as { plant: { exp: number; stage: string } }
    expect(c3.plant.exp).toBe(0)
    expect(c3.plant.stage).toBe('seedling')
  })

  it('awards XP only once under concurrent completion requests', async () => {
    const { token } = await register('grace')
    const created = await app.request('/api/quests', {
      ...json({ title: 'Concurrent quest', difficulty: 'Witch' }), // 50 XP
      headers: { 'Content-Type': 'application/json', ...auth(token) },
    })
    const quest = (await created.json()) as { id: string }

    // Fire two completes at once — only one should award XP.
    await Promise.all([
      app.request(`/api/quests/${quest.id}/complete`, { method: 'POST', headers: auth(token) }),
      app.request(`/api/quests/${quest.id}/complete`, { method: 'POST', headers: auth(token) }),
    ])

    const me = await app.request('/api/auth/me', { headers: auth(token) })
    const meData = (await me.json()) as { plant: { exp: number } }
    expect(meData.plant.exp).toBe(50)
  })

  it('clears a due date when null is sent', async () => {
    const { token } = await register('heidi')
    const created = await app.request('/api/quests', {
      ...json({ title: 'Dated quest', difficulty: 'Slime', dueDate: '2030-01-01' }),
      headers: { 'Content-Type': 'application/json', ...auth(token) },
    })
    const quest = (await created.json()) as { id: string; dueDate: string | null }
    expect(quest.dueDate).not.toBeNull()

    const patched = await app.request(`/api/quests/${quest.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...auth(token) },
      body: JSON.stringify({ dueDate: null }),
    })
    const updated = (await patched.json()) as { dueDate: string | null }
    expect(updated.dueDate).toBeNull()
  })

  it('does not let a user touch another user’s quest', async () => {
    const a = await register('carol')
    const b = await register('dave')

    const created = await app.request('/api/quests', {
      ...json({ title: 'Private quest', difficulty: 'Slime' }),
      headers: { 'Content-Type': 'application/json', ...auth(a.token) },
    })
    const quest = (await created.json()) as { id: string }

    const res = await app.request(`/api/quests/${quest.id}`, { headers: auth(b.token) })
    expect(res.status).toBe(404)
  })
})

describe('reflections', () => {
  it('creates and lists reflections', async () => {
    const { token } = await register('erin')
    const create = await app.request('/api/reflections', {
      ...json({ message: 'Today I started running.' }),
      headers: { 'Content-Type': 'application/json', ...auth(token) },
    })
    expect(create.status).toBe(201)

    const list = await app.request('/api/reflections', { headers: auth(token) })
    const rows = (await list.json()) as unknown[]
    expect(rows).toHaveLength(1)
  })
})

describe('insights', () => {
  it('reports the LLM as disabled and falls back to local content', async () => {
    const { token } = await register('frank')

    const status = await app.request('/api/insights/status')
    const statusData = (await status.json()) as { enabled: boolean; provider: string }
    expect(statusData.enabled).toBe(false)
    expect(statusData.provider).toBe('stub')

    const recap = await app.request('/api/insights/weekly-recap', { headers: auth(token) })
    expect(recap.status).toBe(200)
    const recapData = (await recap.json()) as { summary: string; source: string }
    expect(recapData.source).toBe('local')
    expect(recapData.summary.length).toBeGreaterThan(0)
  })
})
