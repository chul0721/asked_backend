import { PASSWORD, prisma } from './constant'
import Router from 'koa-router'

const router = new Router()

router.get('/data', async (ctx) => {
  const questions = await prisma.question.findMany().catch((err) => {
    throw err
  })
  ctx.body = JSON.stringify({
    data: questions
  })
})

router.post('/regist', async (ctx: any) => {
  const { content }: any = ctx.req.body
  const ip: string = ctx.req.ip

  if (!content) return (ctx.body = JSON.stringify({ success: false, error: 'content is required' }))
  if (content.length > 200)
    return (ctx.body = JSON.stringify({ success: false, error: 'content should be under 200' }))

  const question = await prisma.question
    .create({
      data: {
        content,
        address: ip
      }
    })
    .catch((err) => {
      return (ctx.body = JSON.stringify({ success: false, error: err }))
    })

  return (ctx.body = JSON.stringify({ data: question }))
})

router.post('/anwser', async (ctx: any) => {
  const { id, answer }: any = ctx.req.body
  const password = ctx.request.headers.authorization

  if (!id) return (ctx.body = JSON.stringify({ success: false, error: 'id is required' }))
  if (!answer) return (ctx.body = JSON.stringify({ success: false, error: 'answer is required' }))
  if (!password)
    return (ctx.body = JSON.stringify({ success: false, error: 'password is required' }))
  if (password !== PASSWORD)
    return (ctx.body = JSON.stringify({ success: false, error: 'password is incorrect' }))

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

  return (ctx.body = JSON.stringify({
    data: question
  }))
})

export default router
