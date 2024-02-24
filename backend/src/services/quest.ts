import { Hono } from 'hono'
import { SQL, eq, inArray } from 'drizzle-orm'
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { quest } from '../schema';
import connectDB from '../utils/connectDB';

const app = new Hono()

app.get('/check-database', connectDB, async (c) => {
  console.log(c.get('db'))
  return c.json([])
});

app.get('/:userId', connectDB, async (c) => {
  const param = c.req.param('userId')
  console.log(param)
  // return c.json(await c.get('db').query(quest).where(eq(quest.userId, param)).execute());
  return c.json(await c.get('db').select())
});

app.post('/', connectDB, async (c) => {
  const body = await c.req.json()
  console.log(body)
  if (body.createDate && typeof body.createDate === 'string') {
    body.createDate = new Date(body.createDate);
  }
  if (body.endDate && typeof body.endDate === 'string') {
      body.endDate = new Date(body.endDate);
  }
  return c.json(await c.get('db').insert(quest).values({...body}).returning());
});


export default app