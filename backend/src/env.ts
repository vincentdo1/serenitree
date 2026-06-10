import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:4000'),

  // When set, a real Postgres is used. When blank, the in-process PGlite
  // fallback is used so the app runs with zero external setup.
  DATABASE_URL: z.string().optional(),
  PGLITE_PATH: z.string().default('./.pglite'),

  JWT_SECRET: z.string().min(1).default('dev-insecure-secret-change-me'),
  JWT_TTL_SECONDS: z.coerce.number().int().positive().default(60 * 60 * 24 * 7),

  LLM_PROVIDER: z.enum(['auto', 'anthropic', 'openai', 'stub']).default('auto'),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-haiku-4-5'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
})

export const env = EnvSchema.parse(process.env)

export const isProd = env.NODE_ENV === 'production'

/** Comma-separated CORS origins -> array. */
export const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((o) => o.trim())
  .filter(Boolean)

// Fail loudly in production if the JWT secret was never changed.
if (isProd && env.JWT_SECRET === 'dev-insecure-secret-change-me') {
  throw new Error('JWT_SECRET must be set to a strong value in production.')
}
