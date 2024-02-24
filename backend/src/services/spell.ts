import { Hono } from 'hono'
import { SQL, eq, inArray } from 'drizzle-orm'
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { spell } from '../schema';
import connectDB from '../utils/connectDB';

const app = new Hono()

app.get('/:questId', connectDB, async (c) => {
  const param = c.req.param('questId')
  console.log(param)
  return c.json(await c.get('db').select().from(spell).where(eq(spell.questId, param)).execute());
});

app.post('/:questId', connectDB, async (c) => {
  const body = await c.req.json()
  const param = c.req.param('questId')
  console.log(body)
  console.log(param)
  return c.json(await c.get('db').insert(spell).values({...body}).returning());
});

app.delete('/:questId', connectDB, async (c) => {
  const param = c.req.param('questId')
  console.log(param)
  return c.json(await c.get('db').delete(spell).where(eq(spell.questId, param)).execute());
});

export default app