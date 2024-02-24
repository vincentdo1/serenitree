import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import user from './services/user'
import plant from './services/plant'
import spell from './services/spell'
import reflection from './services/reflection'
import quest from './services/quest'
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { Client } from "pg";


const app = new Hono()

const sql = postgres({
  host: "serenitree.c1i4kckiamtd.us-east-2.rds.amazonaws.com",
  port: 5432,
  user: "postgres",
  password: "serenitree",
  database: "serenitreedb",
});

const db = drizzle(sql);
await migrate(db, { migrationsFolder: 'drizzle' });

app.get('/', (c) => c.text('Hello Node.js!'))

const routes = app.route('/api/user', user).route('/api/plant', plant).route('/api/spell', spell).route('/api/reflection', reflection).route('/api/quest', quest)

serve(app)

export default app
export type AppType = typeof routes