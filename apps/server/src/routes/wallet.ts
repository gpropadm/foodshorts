import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticateToken } from '../utils/auth'
import { calculateTopupCoins, awardFoodcoins } from '../utils/foodcoins'

const prisma = new PrismaClient()

const topupSchema = z.object({
  amount: z.number().min(5).max(1000), // Min R$ 5, Max R$ 1000
  paymentMethod: z.enum(['stripe', 'pix']),
})

export async function walletRoutes(fastify: FastifyInstance) {
  // Get Wallet Info
  fastify.get('/wallet', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          walletCredit: true,
          foodcoins: true,
          foodcoinsExpiry: true,
        }
      })
      
      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }
      
      // Check if foodcoins are expired
      const now = new Date()
      let { foodcoins, foodcoinsExpiry } = user
      
      if (foodcoinsExpiry && foodcoinsExpiry < now && foodcoins > 0) {
        // Reset expired foodcoins
        await prisma.user.update({
          where: { id: userId },
          data: {
            foodcoins: 0,
            foodcoinsExpiry: null,
          }
        })
        foodcoins = 0
        foodcoinsExpiry = null
      }
      
      return reply.send({
        walletCredit: user.walletCredit,
        foodcoins,
        foodcoinsExpiry,
        foodcoinValue: 0.20, // R$ 0.20 per coin
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Top-up Wallet Credit
  fastify.post('/wallet/topup', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = topupSchema.parse(request.body)
      const userId = (request as any).user.userId
      
      // Calculate bonus (5% extra credit)
      const bonusAmount = body.amount * 0.05
      const totalCredit = body.amount + bonusAmount
      
      // Calculate foodcoins bonus (2x for topup)
      const foodcoinsEarned = calculateTopupCoins(body.amount)
      
      // For demo purposes, we'll simulate a successful payment
      // In real app, integrate with Stripe here
      
      const updatedUser = await prisma.$transaction(async (tx) => {
        // Add wallet credit
        const user = await tx.user.update({
          where: { id: userId },
          data: {
            walletCredit: { increment: totalCredit }
          }
        })
        
        // Award foodcoins
        await awardFoodcoins(userId, foodcoinsEarned, 'topup')
        
        return user
      })
      
      return reply.send({
        success: true,
        amount: body.amount,
        bonusAmount,
        totalCredit,
        foodcoinsEarned,
        newBalance: updatedUser.walletCredit,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Wallet Transaction History
  fastify.get('/wallet/transactions', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
      
      const skip = (page - 1) * limit
      
      // Get orders where wallet credit was used
      const orders = await prisma.order.findMany({
        where: {
          userId,
          OR: [
            { walletCreditUsed: { gt: 0 } },
            { foodcoinsUsed: { gt: 0 } }
          ]
        },
        select: {
          id: true,
          total: true,
          walletCreditUsed: true,
          foodcoinsUsed: true,
          createdAt: true,
          vendor: {
            select: {
              businessName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
      
      const transactions = orders.map(order => ({
        id: order.id,
        type: 'expense' as const,
        description: `Pedido - ${order.vendor.businessName}`,
        walletCreditUsed: order.walletCreditUsed,
        foodcoinsUsed: order.foodcoinsUsed,
        createdAt: order.createdAt,
      }))
      
      return reply.send({
        transactions,
        pagination: {
          page,
          limit,
          hasMore: transactions.length === limit
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}