import { serve } from '@hono/node-server'
import app from './app'
import { env } from './env'
import { runMigrations, usingPglite } from './db'
import { llm } from './lib/llm'

async function start() {
  await runMigrations()

  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    const dbKind = usingPglite ? 'PGlite (in-process)' : 'Postgres'
    console.log(`🌳 Serenitree API listening on http://localhost:${info.port}`)
    console.log(`   Database: ${dbKind}`)
    console.log(`   LLM: ${llm.enabled ? llm.name : 'disabled (deterministic fallbacks)'}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
