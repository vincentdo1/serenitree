import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import user from './services/user'
import plant from './services/plant'
import spell from './services/spell'
import reflection from './services/reflection'
import quest from './services/quest'


const app = new Hono()

app.get('/', (c) => c.text('Hello Node.js!'))

const routes = app.route('/api/user', user).route('/api/plant', plant).route('/api/spell', spell).route('/api/reflection', reflection).route('/api/quest', quest)

serve(app)

export default app
export type AppType = typeof routes