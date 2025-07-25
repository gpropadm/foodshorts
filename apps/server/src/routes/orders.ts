import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticateToken } from '../utils/auth'

const prisma = new PrismaClient()

const createOrderSchema = z.object({
  vendorId: z.string().uuid(),
  items: z.array(z.object({
    feedItemId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })),
  deliveryAddress: z.string().min(1),
  deliveryLatitude: z.number(),
  deliveryLongitude: z.number(),
  foodcoinsToUse: z.number().int().min(0).optional(),
  walletCreditToUse: z.number().min(0).optional(),
})

export async function orderRoutes(fastify: FastifyInstance) {
  // Create Order
  fastify.post('/orders', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createOrderSchema.parse(request.body)
      const userId = (request as any).user.userId
      
      // Get user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          id: true, 
          foodcoins: true, 
          walletCredit: true,
          foodcoinsExpiry: true
        }
      })
      
      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }
      
      // Get feed items with prices
      const feedItems = await prisma.feedItem.findMany({
        where: {
          id: { in: body.items.map(item => item.feedItemId) },
          vendorId: body.vendorId,
          isActive: true,
        }
      })
      
      if (feedItems.length !== body.items.length) {
        return reply.status(400).send({ error: 'Alguns itens não foram encontrados' })
      }
      
      // Calculate total
      let subtotal = 0
      const orderItems = body.items.map(item => {
        const feedItem = feedItems.find(fi => fi.id === item.feedItemId)!
        const itemTotal = feedItem.price * item.quantity
        subtotal += itemTotal
        
        return {
          feedItemId: item.feedItemId,
          quantity: item.quantity,
          price: feedItem.price,
        }
      })
      
      const deliveryFee = 5.00 // Fixed for now
      const total = subtotal + deliveryFee
      
      // Validate foodcoins usage
      const foodcoinsToUse = Math.min(
        body.foodcoinsToUse || 0,
        user.foodcoins,
        Math.floor(total * 0.3 * 5) // Max 30% of total, 1 coin = R$ 0.20
      )
      
      // Validate wallet credit usage
      const walletCreditToUse = Math.min(
        body.walletCreditToUse || 0,
        user.walletCredit,
        total - (foodcoinsToUse * 0.2)
      )
      
      const finalTotal = total - (foodcoinsToUse * 0.2) - walletCreditToUse
      
      // Create order
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            userId,
            vendorId: body.vendorId,
            total: finalTotal,
            deliveryFee,
            foodcoinsUsed: foodcoinsToUse,
            walletCreditUsed: walletCreditToUse,
            deliveryAddress: body.deliveryAddress,
            deliveryLatitude: body.deliveryLatitude,
            deliveryLongitude: body.deliveryLongitude,
            estimatedTime: 30, // Default 30 minutes
            items: {
              create: orderItems
            }
          },
          include: {
            items: {
              include: {
                feedItem: true
              }
            },
            vendor: {
              select: {
                id: true,
                businessName: true,
                phone: true,
                address: true,
              }
            }
          }
        })
        
        // Update user balances
        await tx.user.update({
          where: { id: userId },
          data: {
            foodcoins: { decrement: foodcoinsToUse },
            walletCredit: { decrement: walletCreditToUse },
          }
        })
        
        // Award foodcoins for the order (floor(total/5))
        const coinsEarned = Math.floor(subtotal * 0.2) // 1 coin per R$ 5.00
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 60) // 60 days expiry
        
        await tx.user.update({
          where: { id: userId },
          data: {
            foodcoins: { increment: coinsEarned },
            foodcoinsExpiry: expiryDate,
          }
        })
        
        return newOrder
      })
      
      return reply.status(201).send(order)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get User Orders
  fastify.get('/orders', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
      
      const skip = (page - 1) * limit
      
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              feedItem: {
                select: {
                  id: true,
                  title: true,
                  mediaUrl: true,
                }
              }
            }
          },
          vendor: {
            select: {
              id: true,
              businessName: true,
              logo: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
      
      return reply.send({
        orders,
        pagination: {
          page,
          limit,
          hasMore: orders.length === limit
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Order by ID
  fastify.get('/orders/:id', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.userId
      
      const order = await prisma.order.findFirst({
        where: { id, userId },
        include: {
          items: {
            include: {
              feedItem: true
            }
          },
          vendor: {
            select: {
              id: true,
              businessName: true,
              logo: true,
              phone: true,
              address: true,
            }
          },
          review: true,
        }
      })
      
      if (!order) {
        return reply.status(404).send({ error: 'Pedido não encontrado' })
      }
      
      return reply.send(order)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}