import { Hono } from 'hono'

const app = new Hono()

app.get('/:userId', async (c) => {
    const params = c.req.param('userId')
    console.log(params)
    return c.json([]);
});

app.post('/:userId', async (c) => {
    const params = c.req.param('userId')
    console.log(params)
    return c.json([]);
});

app.put('/:userId', async (c) => {
    const params = c.req.param('userId')
    console.log(params)
    return c.json([]);
});

app.delete('/:userId', async (c) => {
    const params = c.req.param('userId')
    console.log(params)
    return c.json([]);
});

export default app