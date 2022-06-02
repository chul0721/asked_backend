import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
export const PORT = process.env.PORT || 4040
export const PASSWORD = process.env.SECRET_KEY || 'secret'
