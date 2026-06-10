import type { Config } from 'drizzle-kit'

// Used by `drizzle-kit generate` to diff the schema and emit SQL migrations.
// Generation does not need a live database connection.
export default {
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
} satisfies Config
