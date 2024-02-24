import { Hono } from 'hono'
import connectDB from '../utils/connectDB';
import { reflection } from '../schema';
import { eq } from 'drizzle-orm'


const app = new Hono()

app.get('/', connectDB, async (c) => {
  const param = c.req.param('questId')
  console.log(param)
  return c.json(await c.get('db').select().from(reflection).execute());
})

app.get('/:questId', connectDB, async (c) => {
  const param = c.req.param('questId')
  console.log(param)
  return c.json(await c.get('db').select().from(reflection).where(eq(reflection.questId, param)).execute());
})

app.post('/', connectDB, async (c) => {
  const body = await c.req.json()
  if (body.date && typeof body.date === 'string') {
    body.date = new Date(body.date);
  }
  return c.json(await c.get('db').insert(reflection).values({...body}).returning());
})

app.delete('/:reflectionId', connectDB, async (c) => {
  const param = c.req.param('reflectionId')
  return c.json(await c.get('db').delete(reflection).where(eq(reflection.id, param)).execute());
})


export default app