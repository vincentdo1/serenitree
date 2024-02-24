import { Hono } from 'hono'
import { SQL, eq, inArray } from 'drizzle-orm'
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { plant } from '../schema';
import connectDB from '../utils/connectDB';

const app = new Hono()

app.get('/:userId', connectDB, async (c) => {
  // Changed to userId
  const param = c.req.param('userId')
  console.log(param)
  return c.json(await c.get('db').select().from(plant).where(eq(plant.userId, param)).execute());
});

app.post('/:userId', connectDB, async (c) => {
  const body = await c.req.json()
  console.log(body)
  return c.json(await c.get('db').insert(plant).values({...body}).returning());
});

app.put('/:userId', connectDB, async (c) => {
  const param = c.req.param('userId')
  const body = await c.req.json()
  console.log(body)
  return c.json(await c.get('db').update(plant).set({ ...body}).where(eq(plant.userId, param)).returning());
});

export default app