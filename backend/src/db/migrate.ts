// Standalone migration runner: `npm run migrate`.
// Applies the SQL in ./drizzle to whichever database the environment points at.
import { runMigrations, closeDb, usingPglite } from './index'
import { env } from '../env'

async function main() {
  const target = usingPglite ? `PGlite (${env.PGLITE_PATH})` : 'Postgres (DATABASE_URL)'
  console.log(`Running migrations against ${target}...`)
  await runMigrations()
  console.log('Migrations complete.')
  await closeDb()
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
