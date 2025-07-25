import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { hashPassword, verifyPassword, generateTokens } from '../utils/auth'

const prisma = new PrismaClient()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function authRoutes(fastify: FastifyInstance) {
  // Register User
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = registerSchema.parse(request.body)
      
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email }
      })
      
      if (existingUser) {
        return reply.status(400).send({ error: 'Email já cadastrado' })
      }
      
      // Hash password
      const hashedPassword = await hashPassword(body.password)
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          walletCredit: true,
          foodcoins: true,
          createdAt: true,
        }
      })
      
      // Generate tokens
      const tokens = generateTokens({ userId: user.id, email: user.email }, fastify)
      
      return reply.send({
        user,
        ...tokens
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Login User
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = loginSchema.parse(request.body)
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: body.email }
      })
      
      if (!user) {
        return reply.status(401).send({ error: 'Credenciais inválidas' })
      }
      
      if (!user.isActive) {
        return reply.status(401).send({ error: 'Conta desativada' })
      }
      
      // Generate tokens
      const tokens = generateTokens({ userId: user.id, email: user.email }, fastify)
      
      const userResponse = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        walletCredit: user.walletCredit,
        foodcoins: user.foodcoins,
        foodcoinsExpiry: user.foodcoinsExpiry,
      }
      
      return reply.send({
        user: userResponse,
        ...tokens
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Refresh Token
  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { refreshToken } = request.body as { refreshToken: string }
      
      if (!refreshToken) {
        return reply.status(401).send({ error: 'Refresh token não fornecido' })
      }
      
      const decoded = fastify.jwt.verify(refreshToken, { 
        key: process.env.JWT_REFRESH_SECRET 
      }) as any
      
      // Generate new tokens
      const tokens = generateTokens({ userId: decoded.userId, email: decoded.email }, fastify)
      
      return reply.send(tokens)
    } catch (error) {
      return reply.status(401).send({ error: 'Refresh token inválido' })
    }
  })
}