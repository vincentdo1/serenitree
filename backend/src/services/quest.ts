import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { quest } from '../schema';
import connectDB from '../utils/connectDB';

const app = new Hono()

app.get('/:userId', connectDB, async (c) => {
  const param = c.req.param('userId')
  console.log(param)
  // return c.json(await c.get('db').query(quest).where(eq(quest.userId, param)).execute());
  return c.json(await c.get('db').select().from(quest).where(eq(quest.userId, param)).execute());
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

app.put('/:questId', connectDB, async (c) => {
  const param = c.req.param('questId')
  const body = await c.req.json()
  console.log(body)
  if (body.createDate && typeof body.createDate === 'string') {
    body.createDate = new Date(body.createDate);
  }
  if (body.endDate && typeof body.endDate === 'string') {
      body.endDate = new Date(body.endDate);
  }
  return c.json(await c.get('db').update(quest).set({ ...body}).where(eq(quest.id, param)).returning());
});

app.delete('/:questId', connectDB, async (c) => {
  const param = c.req.param('questId')
  return c.json(await c.get('db').delete(quest).where(eq(quest.id, param)).execute());
});




export default app