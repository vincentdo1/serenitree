import { join } from 'node:path'
import { drizzle as drizzlePg, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { migrate as migratePg } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite'
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator'
import { PGlite } from '@electric-sql/pglite'
import * as schema from '../schema'
import { env } from '../env'

export type DB = PostgresJsDatabase<typeof schema>

const MIGRATIONS_FOLDER = join(process.cwd(), 'drizzle')

let migrateFn: () => Promise<void>
let closeFn: () => Promise<void>

// One shared connection per process (the original opened one per request and
// never closed it). DATABASE_URL set -> Postgres; blank -> in-process PGlite.
// Both speak the same dialect, so schema and migrations are shared.
function createDb(): DB {
  if (env.DATABASE_URL) {
    const client = postgres(env.DATABASE_URL, { max: 10 })
    const db = drizzlePg(client, { schema })
    migrateFn = () => migratePg(db, { migrationsFolder: MIGRATIONS_FOLDER })
    closeFn = () => client.end()
    return db
  }

  const client = new PGlite(env.PGLITE_PATH)
  const db = drizzlePglite(client, { schema })
  migrateFn = () => migratePglite(db, { migrationsFolder: MIGRATIONS_FOLDER })
  closeFn = () => client.close()
  // PGlite's drizzle type is structurally identical for our query surface.
  return db as unknown as DB
}

export const db = createDb()

export const usingPglite = !env.DATABASE_URL

export async function runMigrations(): Promise<void> {
  await migrateFn()
}

export async function closeDb(): Promise<void> {
  await closeFn()
}
