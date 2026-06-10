import { defineConfig } from 'vitest/config'

// Applied to process.env before any test module imports src/env.ts or src/db —
// pins tests to a fresh in-memory PGlite (an in-file assignment can't, since ESM
// evaluates imports first).
export default defineConfig({
  test: {
    env: {
      DATABASE_URL: '',
      PGLITE_PATH: 'memory://',
      JWT_SECRET: 'test-secret',
      LLM_PROVIDER: 'stub',
      CORS_ORIGIN: 'http://localhost:4000',
    },
  },
})
