import { Hono } from 'hono'
import {cache} from 'hono/cache'
const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app