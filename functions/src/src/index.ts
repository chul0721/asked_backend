import fastify, { FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { PASSWORD } from './constant'
import 'dotenv/config'
import * as http from "http"
import * as functions from "firebase-functions"

const prisma = new PrismaClient()

let handleRequest: any = null

const serverFactory = (handler: any, opts: any) => {
  handleRequest = handler
  return http.createServer()
}
const app = fastify({serverFactory})

app.register(cors, { origin: '*' })

app.get('/data', async () => {
  const questions = await prisma.question.findMany().catch((err: any) => {
    console.log(err)
    throw err
  })
  return {
    data: questions
  }
})

app.post('/regist', async (req: FastifyRequest, res) => {
  const { content }: any = req.body
  const ip: string = req.ip

  if (!content) return res.send({ success: false, error: 'content is required' })
  if (content.length > 200)
    return res.send({ success: false, error: 'content should be under 200' })

  console.log(content)

  const question = await prisma.question
    .create({
      data: {
        content,
        address: ip
      }
    })
    .catch((err: any) => {
      console.log(err)
      throw err
    })

  return {
    data: question
  }
})

app.post('/anwser', async (req: FastifyRequest, res) => {
  const { id, answer }: any = req.body
  const password = req.headers.authorization

  if (!id) return res.send({ success: false, error: 'id is required' })
  if (!answer) return res.send({ success: false, error: 'answer is required' })
  if (!password) return res.send({ success: false, error: 'password is required' })
  if (password !== PASSWORD) return res.send({ success: false, error: 'password is incorrect' })

  console.log(answer)

  const question = await prisma.question
    .update({
      where: {
        id
      },
      data: {
        answer,
        isAnswered: true
      }
    })
    .catch((err: any) => {
      console.log(err)
      throw err
    })

  return res.send({ data: question })
})

export const asked = functions.https.onRequest((req, res) => {
  app.ready((err) => { 
  if (err)  throw err
  handleRequest(req, res)
})
})
