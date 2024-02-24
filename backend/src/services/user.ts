import { Hono } from 'hono'
import { SQL, eq, inArray } from 'drizzle-orm'
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { user } from '../schema';
import connectDB from '../utils/connectDB';

const app = new Hono()

app.get('/:userId', connectDB, async (c) => {
  const param = await c.req.param('userId')

  console.log(param)

  return c.json(await c.get('db').select().from(user).where(eq(user.id, param)).execute());
});

app.post('/', connectDB, async (c) => {
  const body = await c.req.json()

  console.log(body)

  return c.json(await c.get('db').insert(user).values({...body}).returning());
});

export default app