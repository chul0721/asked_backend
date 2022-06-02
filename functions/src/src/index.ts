import Koa from 'koa'
import cors from '@koa/cors'
import 'dotenv/config'
import * as functions from 'firebase-functions'
import router from './router'

const app = new Koa()

app.use(
  cors({
    origin: '*',
    credentials: true,
    keepHeadersOnError: true
  })
)
app.use(router.routes())
app.use(router.allowedMethods())

export const asked = functions.https.onRequest(app.callback() as any)
