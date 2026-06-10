import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../db'
import { quests, reflections } from '../schema'
import { requireAuth } from '../middleware/auth'
import type { AppEnv } from '../types'

const app = new Hono<AppEnv>()
app.use('*', requireAuth)

const createSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  questId: z.string().optional(),
})

const querySchema = z.object({
  questId: z.string().optional(),
})

app.get('/', zValidator('query', querySchema), async (c) => {
  const userId = c.get('userId')
  const { questId } = c.req.valid('query')

  const where = questId
    ? and(eq(reflections.userId, userId), eq(reflections.questId, questId))
    : eq(reflections.userId, userId)

  const rows = await db
    .select()
    .from(reflections)
    .where(where)
    .orderBy(desc(reflections.createdAt))
  return c.json(rows)
})

app.post('/', zValidator('json', createSchema), async (c) => {
  const userId = c.get('userId')
  const { message, questId } = c.req.valid('json')

  // If a quest is referenced, make sure it belongs to the caller.
  if (questId) {
    const [quest] = await db
      .select({ id: quests.id })
      .from(quests)
      .where(and(eq(quests.id, questId), eq(quests.userId, userId)))
      .limit(1)
    if (!quest) throw new HTTPException(404, { message: 'Quest not found.' })
  }

  const [reflection] = await db
    .insert(reflections)
    .values({ userId, questId: questId ?? null, message })
    .returning()
  return c.json(reflection, 201)
})

app.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const [existing] = await db
    .select({ id: reflections.id })
    .from(reflections)
    .where(and(eq(reflections.id, id), eq(reflections.userId, userId)))
    .limit(1)
  if (!existing) throw new HTTPException(404, { message: 'Reflection not found.' })

  await db.delete(reflections).where(eq(reflections.id, id))
  return c.body(null, 204)
})

export default app
