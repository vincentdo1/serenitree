import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { corsOrigins } from './env'
import auth from './services/auth'
import quests from './services/quests'
import plant from './services/plant'
import reflections from './services/reflections'
import insights from './services/insights'
import type { AppEnv } from './types'

// The app is built here (no server, no migrations) so tests can import it and
// drive it via `app.request(...)` without binding a port. index.ts wraps it.
export const app = new Hono<AppEnv>()

app.use(
  '*',
  cors({
    origin: corsOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
)

app.get('/', (c) => c.json({ name: 'Serenitree API', status: 'ok' }))
app.get('/health', (c) => c.json({ status: 'ok' }))

app.route('/api/auth', auth)
app.route('/api/quests', quests)
app.route('/api/plant', plant)
app.route('/api/reflections', reflections)
app.route('/api/insights', insights)

app.notFound((c) => c.json({ error: 'Not found' }, 404))

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
