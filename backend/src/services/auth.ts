import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { eq, or } from 'drizzle-orm'
import { db } from '../db'
import { plants, users, type User } from '../schema'
import { hashPassword, signToken, verifyPassword } from '../lib/auth'
import { summarizeProgress } from '../lib/leveling'
import { requireAuth } from '../middleware/auth'
import type { AppEnv } from '../types'

const app = new Hono<AppEnv>()

const registerSchema = z.object({
  username: z.string().trim().min(3).max(32),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
})

const loginSchema = z.object({
  identifier: z.string().trim().min(1), // username or email
  password: z.string().min(1),
})

/** Strip the password hash before sending a user to the client. */
function publicUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  }
}

app.post('/register', zValidator('json', registerSchema), async (c) => {
  const { username, email, password } = c.req.valid('json')

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .limit(1)

  if (existing.length > 0) {
    throw new HTTPException(409, { message: 'Username or email is already taken.' })
  }

  const passwordHash = await hashPassword(password)
  const [user] = await db.insert(users).values({ username, email, passwordHash }).returning()

  // Every user gets a seedling to grow.
  await db.insert(plants).values({ userId: user.id })

  const token = await signToken(user.id)
  return c.json({ token, user: publicUser(user) }, 201)
})

app.post('/login', zValidator('json', loginSchema), async (c) => {
  const { identifier, password } = c.req.valid('json')

  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.username, identifier), eq(users.email, identifier)))
    .limit(1)

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new HTTPException(401, { message: 'Invalid credentials.' })
  }

  const token = await signToken(user.id)
  return c.json({ token, user: publicUser(user) })
})

app.get('/me', requireAuth, async (c) => {
  const userId = c.get('userId')

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user) throw new HTTPException(404, { message: 'User not found.' })

  const [plant] = await db.select().from(plants).where(eq(plants.userId, userId)).limit(1)
  const progress = summarizeProgress(plant?.exp ?? 0)

  return c.json({ user: publicUser(user), plant: progress })
})

export default app
