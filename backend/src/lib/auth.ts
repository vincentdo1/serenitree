import bcrypt from 'bcryptjs'
import { sign, verify } from 'hono/jwt'
import { env } from '../env'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export interface TokenPayload {
  sub: string
  exp: number
  [key: string]: unknown
}

export async function signToken(userId: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload: TokenPayload = {
    sub: userId,
    iat: now,
    exp: now + env.JWT_TTL_SECONDS,
  }
  return sign(payload, env.JWT_SECRET, 'HS256')
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  return (await verify(token, env.JWT_SECRET, 'HS256')) as TokenPayload
}
