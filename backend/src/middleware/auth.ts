import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { verifyToken } from '../lib/auth'
import type { AppEnv } from '../types'

// Requires a valid Bearer JWT and sets `userId` on the context.
export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header('Authorization') ?? ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw new HTTPException(401, { message: 'Missing or malformed Authorization header.' })
  }

  try {
    const payload = await verifyToken(token)
    if (!payload.sub) throw new Error('No subject in token.')
    c.set('userId', payload.sub)
  } catch {
    throw new HTTPException(401, { message: 'Invalid or expired token.' })
  }

  await next()
})
