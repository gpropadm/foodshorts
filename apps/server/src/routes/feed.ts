import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticateToken } from '../utils/auth'

const prisma = new PrismaClient()

const createFeedItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  mediaUrl: z.string().url(),
  mediaType: z.enum(['image', 'video']),
})

export async function feedRoutes(fastify: FastifyInstance) {
  // Get Feed Items
  fastify.get('/feed', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
      
      const skip = (page - 1) * limit
      
      const feedItems = await prisma.feedItem.findMany({
        where: { isActive: true },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              logo: true,
              stars: true,
              rankingScore: true,
            }
          }
        },
        orderBy: [
          { vendor: { rankingScore: 'desc' } },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      })
      
      return reply.send({
        items: feedItems,
        pagination: {
          page,
          limit,
          hasMore: feedItems.length === limit
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Feed Item by ID
  fastify.get('/feed/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      
      const feedItem = await prisma.feedItem.findUnique({
        where: { id },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              description: true,
              logo: true,
              banner: true,
              phone: true,
              address: true,
              stars: true,
              rankingScore: true,
            }
          }
        }
      })
      
      if (!feedItem || !feedItem.isActive) {
        return reply.status(404).send({ error: 'Item não encontrado' })
      }
      
      // Increment views
      await prisma.feedItem.update({
        where: { id },
        data: { views: { increment: 1 } }
      })
      
      return reply.send(feedItem)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Create Feed Item (Vendor only)
  fastify.post('/feed', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createFeedItemSchema.parse(request.body)
      const vendorId = (request as any).user.vendorId
      
      if (!vendorId) {
        return reply.status(403).send({ error: 'Acesso negado. Apenas lojistas podem criar itens' })
      }
      
      const feedItem = await prisma.feedItem.create({
        data: {
          ...body,
          vendorId,
        },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              logo: true,
              stars: true,
            }
          }
        }
      })
      
      return reply.status(201).send(feedItem)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Search Feed Items
  fastify.get('/feed/search', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { q, page = 1, limit = 20 } = request.query as { 
        q?: string; 
        page?: number; 
        limit?: number 
      }
      
      if (!q || q.trim().length < 2) {
        return reply.status(400).send({ error: 'Query de busca deve ter pelo menos 2 caracteres' })
      }
      
      const skip = (page - 1) * limit
      
      const feedItems = await prisma.feedItem.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: q.trim(), mode: 'insensitive' } },
            { description: { contains: q.trim(), mode: 'insensitive' } },
            { vendor: { businessName: { contains: q.trim(), mode: 'insensitive' } } }
          ]
        },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              logo: true,
              stars: true,
              rankingScore: true,
            }
          }
        },
        orderBy: [
          { vendor: { rankingScore: 'desc' } },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      })
      
      return reply.send({
        items: feedItems,
        query: q,
        pagination: {
          page,
          limit,
          hasMore: feedItems.length === limit
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}