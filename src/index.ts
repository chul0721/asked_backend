import fastify, { FastifyRequest } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { PASSWORD, PORT } from './constant'
import 'dotenv/config'

const prisma = new PrismaClient()
const app = fastify({ trustProxy: true })

app.get('/data', async () => {
  const questions = await prisma.question.findMany().catch((err) => {
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
    .catch((err) => {
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
        answer
      }
    })
    .catch((err) => {
      console.log(err)
      throw err
    })
})

app.listen(PORT, (err) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(`Server listening at http://localhost:${PORT}`)
})
