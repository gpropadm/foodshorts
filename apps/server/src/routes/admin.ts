import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticateToken } from '../utils/auth'

const prisma = new PrismaClient()

const auditLogQuery = z.object({
  page: z.number().default(1),
  limit: z.number().default(50),
  userId: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const moderateContentSchema = z.object({
  feedItemId: z.string().uuid(),
  action: z.enum(['approve', 'reject', 'flag']),
  reason: z.string().optional(),
})

export async function adminRoutes(fastify: FastifyInstance) {
  // Admin middleware (in real app, check admin role)
  const adminAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    await authenticateToken(request, reply)
    
    // In real app, check if user has admin role
    const userId = (request as any).user.userId
    // const user = await prisma.user.findUnique({ where: { id: userId } })
    // if (!user?.isAdmin) {
    //   return reply.status(403).send({ error: 'Acesso negado' })
    // }
  }
  
  // Dashboard Stats
  fastify.get('/admin/stats', {
    preHandler: adminAuth
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const [
        totalUsers,
        totalVendors,
        totalOrders,
        totalRevenue,
        ordersToday,
        newUsersToday,
        activeVendors,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.vendorProfile.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: 'DELIVERED' }
        }),
        prisma.order.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        prisma.vendorProfile.count({
          where: { isActive: true }
        }),
      ])
      
      const avgOrderValue = totalOrders > 0 
        ? (totalRevenue._sum.total || 0) / totalOrders 
        : 0
      
      return reply.send({
        totalUsers,
        totalVendors,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        ordersToday,
        newUsersToday,
        activeVendors,
        avgOrderValue,
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Audit Logs
  fastify.get('/admin/audit', {
    preHandler: adminAuth
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = auditLogQuery.parse(request.query)
      const { page, limit, userId, action, startDate, endDate } = query
      
      const skip = (page - 1) * limit
      
      const where: any = {}
      if (userId) where.userId = userId
      if (action) where.action = { contains: action, mode: 'insensitive' }
      if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt.gte = new Date(startDate)
        if (endDate) where.createdAt.lte = new Date(endDate)
      }
      
      const [logs, totalCount] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.auditLog.count({ where })
      ])
      
      return reply.send({
        logs,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Parâmetros inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Log Admin Action
  fastify.post('/admin/audit', {
    preHandler: adminAuth
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { action, targetId, metadata } = request.body as {
        action: string
        targetId?: string
        metadata?: any
      }
      
      const adminId = (request as any).user.userId
      
      const log = await prisma.auditLog.create({
        data: {
          adminId,
          action,
          targetId,
          metadata,
        }
      })
      
      return reply.status(201).send(log)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Content Moderation
  fastify.post('/admin/moderate', {
    preHandler: adminAuth
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = moderateContentSchema.parse(request.body)
      const adminId = (request as any).user.userId
      
      const feedItem = await prisma.feedItem.findUnique({
        where: { id: body.feedItemId },
        include: { vendor: true }
      })
      
      if (!feedItem) {
        return reply.status(404).send({ error: 'Item do feed não encontrado' })
      }
      
      let updateData: any = {}
      let auditAction = ''
      
      switch (body.action) {
        case 'approve':
          updateData = { isActive: true }
          auditAction = 'CONTENT_APPROVED'
          break
        case 'reject':
          updateData = { isActive: false }
          auditAction = 'CONTENT_REJECTED'
          break
        case 'flag':
          auditAction = 'CONTENT_FLAGGED'
          break
      }
      
      if (Object.keys(updateData).length > 0) {
        await prisma.feedItem.update({
          where: { id: body.feedItemId },
          data: updateData
        })
      }
      
      // Log moderation action
      await prisma.auditLog.create({
        data: {
          adminId,
          action: auditAction,
          targetId: body.feedItemId,
          metadata: {
            feedItemTitle: feedItem.title,
            vendorName: feedItem.vendor.businessName,
            reason: body.reason,
            moderationAction: body.action,
          }
        }
      })
      
      return reply.send({
        message: `Conteúdo ${body.action === 'approve' ? 'aprovado' : 
                  body.action === 'reject' ? 'rejeitado' : 'sinalizado'} com sucesso`,
        feedItem: {
          id: feedItem.id,
          title: feedItem.title,
          isActive: updateData.isActive ?? feedItem.isActive,
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Pending Content for Moderation
  fastify.get('/admin/moderate/pending', {
    preHandler: adminAuth
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
      const skip = (page - 1) * limit
      
      // In real app, you might have a "pending review" status
      const pendingItems = await prisma.feedItem.findMany({
        where: {
          // Add criteria for content that needs moderation
          // For example: reportCount > 0 or isActive: null
        },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
      
      return reply.send({
        items: pendingItems,
        pagination: {
          page,
          limit,
          hasMore: pendingItems.length === limit
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // System Health Check
  fastify.get('/admin/health', {
    preHandler: adminAuth
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const checks = await Promise.allSettled([
        // Database check
        prisma.$queryRaw`SELECT 1`,
        
        // Check recent backups (mock)
        Promise.resolve(new Date()),
        
        // Check API usage (mock)
        Promise.resolve({ googleMaps: 180, openAI: 45 }),
      ])
      
      const dbHealth = checks[0].status === 'fulfilled'
      const lastBackup = checks[1].status === 'fulfilled' 
        ? (checks[1].value as Date) 
        : null
      const apiUsage = checks[2].status === 'fulfilled' 
        ? (checks[2].value as any) 
        : null
      
      const alerts = []
      
      if (!dbHealth) {
        alerts.push({
          type: 'error',
          message: 'Falha na conexão com banco de dados',
          timestamp: new Date()
        })
      }
      
      if (lastBackup && (Date.now() - lastBackup.getTime()) > 2 * 60 * 60 * 1000) {
        alerts.push({
          type: 'warning',
          message: 'Backup atrasado',
          timestamp: new Date(),
          details: `Último backup há ${Math.round((Date.now() - lastBackup.getTime()) / (60 * 60 * 1000))} horas`
        })
      }
      
      if (apiUsage?.googleMaps > 200) {
        alerts.push({
          type: 'error',
          message: 'Alto uso de API Google Maps',
          timestamp: new Date(),
          details: `R$ ${apiUsage.googleMaps}/dia`
        })
      }
      
      return reply.send({
        status: dbHealth ? 'healthy' : 'unhealthy',
        database: dbHealth,
        lastBackup,
        apiUsage,
        alerts,
        timestamp: new Date(),
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}