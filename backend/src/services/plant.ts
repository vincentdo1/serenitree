import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { plants } from '../schema'
import { summarizeProgress } from '../lib/leveling'
import { requireAuth } from '../middleware/auth'
import type { AppEnv } from '../types'

const app = new Hono<AppEnv>()
app.use('*', requireAuth)

// Tree stage is derived from XP; the client never writes it directly.
app.get('/', async (c) => {
  const userId = c.get('userId')
  const [plant] = await db.select().from(plants).where(eq(plants.userId, userId)).limit(1)
  return c.json(summarizeProgress(plant?.exp ?? 0))
})

export default app
