import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { and, desc, eq, sql } from 'drizzle-orm'
import { db, type DB } from '../db'
import { plants, quests, type Quest } from '../schema'
import { DIFFICULTY_XP, summarizeProgress, xpForDifficulty } from '../lib/leveling'
import { requireAuth } from '../middleware/auth'
import type { AppEnv } from '../types'

type Tx = Parameters<Parameters<DB['transaction']>[0]>[0]

const app = new Hono<AppEnv>()
app.use('*', requireAuth)

const difficultyEnum = z.enum(Object.keys(DIFFICULTY_XP) as [string, ...string[]])

const createSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional().default(''),
  category: z.string().trim().max(60).optional(),
  difficulty: difficultyEnum.default('Slime'),
  dueDate: z.coerce.date().optional(),
})

// Update allows clearing nullable fields by sending `null`.
const updateSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  category: z.string().trim().max(60).nullable().optional(),
  difficulty: difficultyEnum.optional(),
  dueDate: z.coerce.date().nullable().optional(),
})

/** Load a quest and assert it belongs to the caller. */
async function getOwnedQuest(userId: string, questId: string): Promise<Quest> {
  const [quest] = await db
    .select()
    .from(quests)
    .where(and(eq(quests.id, questId), eq(quests.userId, userId)))
    .limit(1)
  if (!quest) throw new HTTPException(404, { message: 'Quest not found.' })
  return quest
}

app.get('/', async (c) => {
  const userId = c.get('userId')
  const rows = await db
    .select()
    .from(quests)
    .where(eq(quests.userId, userId))
    .orderBy(desc(quests.createdAt))
  return c.json(rows)
})

app.get('/:id', async (c) => {
  const quest = await getOwnedQuest(c.get('userId'), c.req.param('id'))
  return c.json(quest)
})

app.post('/', zValidator('json', createSchema), async (c) => {
  const userId = c.get('userId')
  const body = c.req.valid('json')
  const [quest] = await db
    .insert(quests)
    .values({
      userId,
      title: body.title,
      description: body.description,
      category: body.category,
      difficulty: body.difficulty,
      xpReward: xpForDifficulty(body.difficulty),
      dueDate: body.dueDate,
    })
    .returning()
  return c.json(quest, 201)
})

app.patch('/:id', zValidator('json', updateSchema), async (c) => {
  const userId = c.get('userId')
  const questId = c.req.param('id')
  await getOwnedQuest(userId, questId)
  const body = c.req.valid('json')

  const patch: Partial<typeof quests.$inferInsert> = { ...body }
  if (body.difficulty) patch.xpReward = xpForDifficulty(body.difficulty)

  const [updated] = await db
    .update(quests)
    .set(patch)
    .where(eq(quests.id, questId))
    .returning()
  return c.json(updated)
})

app.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const questId = c.req.param('id')
  await getOwnedQuest(userId, questId)
  await db.delete(quests).where(eq(quests.id, questId))
  return c.body(null, 204)
})

// Complete a quest and award XP. The completed=false guard prevents
// double-awarding if two requests race.
app.post('/:id/complete', async (c) => {
  const userId = c.get('userId')
  const existing = await getOwnedQuest(userId, c.req.param('id'))

  const result = await db.transaction(async (tx) => {
    const [changed] = await tx
      .update(quests)
      .set({ completed: true, completedAt: new Date() })
      .where(and(eq(quests.id, existing.id), eq(quests.userId, userId), eq(quests.completed, false)))
      .returning()

    if (changed) {
      return { quest: changed, plant: await adjustExp(tx, userId, changed.xpReward) }
    }
    // Already completed — no XP change.
    return { quest: existing, plant: await currentProgress(tx, userId) }
  })

  return c.json(result)
})

/** Undo completion and remove the awarded XP (clamped at zero). */
app.post('/:id/uncomplete', async (c) => {
  const userId = c.get('userId')
  const existing = await getOwnedQuest(userId, c.req.param('id'))

  const result = await db.transaction(async (tx) => {
    const [changed] = await tx
      .update(quests)
      .set({ completed: false, completedAt: null })
      .where(and(eq(quests.id, existing.id), eq(quests.userId, userId), eq(quests.completed, true)))
      .returning()

    if (changed) {
      return { quest: changed, plant: await adjustExp(tx, userId, -changed.xpReward) }
    }
    return { quest: existing, plant: await currentProgress(tx, userId) }
  })

  return c.json(result)
})

/** Read the plant's current progress without mutating it. */
async function currentProgress(tx: Tx, userId: string) {
  const [plant] = await tx.select().from(plants).where(eq(plants.userId, userId)).limit(1)
  return summarizeProgress(plant?.exp ?? 0)
}

/** Apply an XP delta with an atomic increment, then keep the stored stage in sync. */
async function adjustExp(tx: Tx, userId: string, delta: number) {
  const [plant] = await tx
    .update(plants)
    .set({ exp: sql`GREATEST(0, ${plants.exp} + ${delta})`, updatedAt: new Date() })
    .where(eq(plants.userId, userId))
    .returning()

  // A plant is created at registration; this only guards against missing rows.
  if (!plant) {
    const progress = summarizeProgress(Math.max(0, delta))
    await tx.insert(plants).values({ userId, exp: progress.exp, stage: progress.stage })
    return progress
  }

  const progress = summarizeProgress(plant.exp)
  if (plant.stage !== progress.stage) {
    await tx.update(plants).set({ stage: progress.stage }).where(eq(plants.userId, userId))
  }
  return progress
}

export default app
