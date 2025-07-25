import { FastifyRequest, FastifyReply } from 'fastify'
import * as argon2 from 'argon2'

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  })
}

export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, password)
  } catch {
    return false
  }
}

export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return reply.status(401).send({ error: 'Token não fornecido' })
    }

    const decoded = request.jwt.verify(token)
    request.user = decoded as any
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido' })
  }
}

export function generateTokens(payload: any, fastify: any) {
  const accessToken = fastify.jwt.sign(payload, { expiresIn: '15m' })
  const refreshToken = fastify.jwt.sign(payload, { 
    expiresIn: '7d',
    key: process.env.JWT_REFRESH_SECRET 
  })
  
  return { accessToken, refreshToken }
}