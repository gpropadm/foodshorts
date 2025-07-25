import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticateToken } from '../utils/auth'
import * as fs from 'fs'
import * as path from 'path'
import * as archiver from 'archiver'

const prisma = new PrismaClient()

const dataExportSchema = z.object({
  format: z.enum(['json', 'csv']).default('json'),
  includeOrders: z.boolean().default(true),
  includeReviews: z.boolean().default(true),
  includeChats: z.boolean().default(true),
})

export async function privacyRoutes(fastify: FastifyInstance) {
  // Export User Data (LGPD Article 15)
  fastify.get('/me/export', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId
      const query = dataExportSchema.parse(request.query)
      
      // Get all user data
      const userData = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          orders: query.includeOrders ? {
            include: {
              items: {
                include: {
                  feedItem: {
                    select: {
                      title: true,
                      price: true,
                    }
                  }
                }
              },
              vendor: {
                select: {
                  businessName: true,
                  address: true,
                }
              },
              review: query.includeReviews,
            }
          } : false,
          reviews: query.includeReviews ? {
            include: {
              order: {
                select: {
                  id: true,
                  createdAt: true,
                  vendor: {
                    select: {
                      businessName: true,
                    }
                  }
                }
              }
            }
          } : false,
          supportChats: query.includeChats ? {
            include: {
              messages: true,
            }
          } : false,
        }
      })
      
      if (!userData) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }
      
      // Log export request
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'DATA_EXPORT_REQUESTED',
          metadata: {
            format: query.format,
            timestamp: new Date(),
            includeOrders: query.includeOrders,
            includeReviews: query.includeReviews,
            includeChats: query.includeChats,
          }
        }
      })
      
      // Prepare export data
      const exportData = {
        exportInfo: {
          userId: userData.id,
          exportDate: new Date().toISOString(),
          format: query.format,
          compliance: 'LGPD - Lei Geral de Proteção de Dados',
        },
        personalData: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          avatar: userData.avatar,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        },
        financialData: {
          walletCredit: userData.walletCredit,
          foodcoins: userData.foodcoins,
          foodcoinsExpiry: userData.foodcoinsExpiry,
        },
        orders: userData.orders?.map(order => ({
          id: order.id,
          vendor: order.vendor.businessName,
          total: order.total,
          status: order.status,
          deliveryAddress: order.deliveryAddress,
          createdAt: order.createdAt,
          deliveredAt: order.deliveredAt,
          items: order.items.map(item => ({
            product: item.feedItem.title,
            quantity: item.quantity,
            price: item.price,
          })),
          review: order.review ? {
            rating: order.review.rating,
            comment: order.review.comment,
            createdAt: order.review.createdAt,
          } : null,
        })) || [],
        reviews: userData.reviews?.map(review => ({
          orderId: review.orderId,
          vendor: review.order.vendor.businessName,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        })) || [],
        supportChats: userData.supportChats?.map(chat => ({
          id: chat.id,
          subject: chat.subject,
          status: chat.status,
          priority: chat.priority,
          createdAt: chat.createdAt,
          messages: chat.messages.map(msg => ({
            content: msg.content,
            isFromUser: msg.isFromUser,
            createdAt: msg.createdAt,
          })),
        })) || [],
      }
      
      if (query.format === 'json') {
        reply.header('Content-Type', 'application/json')
        reply.header('Content-Disposition', `attachment; filename="foodshorts-data-${userId}.json"`)
        return reply.send(exportData)
      } else {
        // CSV format - simplified version
        const csvData = convertToCSV(exportData)
        reply.header('Content-Type', 'text/csv')
        reply.header('Content-Disposition', `attachment; filename="foodshorts-data-${userId}.csv"`)
        return reply.send(csvData)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Parâmetros inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Delete User Account (LGPD Article 18)
  fastify.delete('/me', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId
      const { confirmation } = request.body as { confirmation: string }
      
      if (confirmation !== 'DELETE_MY_ACCOUNT') {
        return reply.status(400).send({ 
          error: 'Confirmação necessária. Envie { "confirmation": "DELETE_MY_ACCOUNT" }' 
        })
      }
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        }
      })
      
      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }
      
      // Log deletion request
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'ACCOUNT_DELETION_REQUESTED',
          metadata: {
            userEmail: user.email,
            userName: `${user.firstName} ${user.lastName}`,
            timestamp: new Date(),
            reason: 'User requested account deletion (LGPD)',
          }
        }
      })
      
      // Perform cascading deletion
      await prisma.$transaction(async (tx) => {
        // Delete audit logs (except deletion log)
        await tx.auditLog.deleteMany({
          where: { 
            userId,
            action: { not: 'ACCOUNT_DELETION_REQUESTED' }
          }
        })
        
        // Delete chat messages
        await tx.chatMessage.deleteMany({
          where: {
            chat: { userId }
          }
        })
        
        // Delete support chats
        await tx.supportChat.deleteMany({
          where: { userId }
        })
        
        // Delete reviews
        await tx.review.deleteMany({
          where: { userId }
        })
        
        // Delete order items
        await tx.orderItem.deleteMany({
          where: {
            order: { userId }
          }
        })
        
        // Delete delivery metrics
        await tx.deliveryMetric.deleteMany({
          where: {
            order: { userId }
          }
        })
        
        // Delete orders
        await tx.order.deleteMany({
          where: { userId }
        })
        
        // Finally delete user
        await tx.user.delete({
          where: { id: userId }
        })
      })
      
      return reply.send({
        message: 'Conta deletada com sucesso',
        deletedAt: new Date().toISOString(),
        compliance: 'Dados removidos conforme LGPD Article 18',
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Update Data Preferences
  fastify.put('/me/privacy', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId
      const { 
        marketingEmails = true,
        analyticsTracking = true,
        locationTracking = true,
      } = request.body as {
        marketingEmails?: boolean
        analyticsTracking?: boolean
        locationTracking?: boolean
      }
      
      // In a real app, you'd store these preferences in a separate table
      // For now, we'll log the preference changes
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'PRIVACY_PREFERENCES_UPDATED',
          metadata: {
            marketingEmails,
            analyticsTracking,
            locationTracking,
            timestamp: new Date(),
          }
        }
      })
      
      return reply.send({
        message: 'Preferências de privacidade atualizadas',
        preferences: {
          marketingEmails,
          analyticsTracking,
          locationTracking,
        },
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Privacy Policy and Terms
  fastify.get('/privacy-policy', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      version: '1.0',
      lastUpdated: '2024-01-15',
      policy: {
        dataCollection: [
          'Informações de cadastro (nome, email, telefone)',
          'Dados de pedidos e preferências',
          'Localização para entrega',
          'Informações de pagamento (via Stripe)',
          'Logs de uso e interações no app',
        ],
        dataUsage: [
          'Processamento de pedidos',
          'Melhoria da experiência do usuário',
          'Comunicação sobre pedidos e promoções',
          'Prevenção de fraudes',
          'Cumprimento de obrigações legais',
        ],
        dataSharing: [
          'Lojistas parceiros (apenas dados necessários para entrega)',
          'Processadores de pagamento (Stripe)',
          'Serviços de mapas e entrega',
          'Autoridades competentes quando exigido por lei',
        ],
        userRights: [
          'Acesso aos seus dados pessoais',
          'Correção de dados incorretos',
          'Exclusão de dados pessoais',
          'Portabilidade de dados',
          'Oposição ao processamento',
          'Revogação de consentimento',
        ],
        contact: {
          email: 'privacidade@foodshorts.com',
          phone: '(11) 99999-0000',
          address: 'Rua da Privacidade, 123 - São Paulo, SP',
        }
      }
    })
  })
}

// Helper function to convert JSON to CSV
function convertToCSV(data: any): string {
  const lines: string[] = []
  
  // Personal Data
  lines.push('DADOS PESSOAIS')
  lines.push('Campo,Valor')
  Object.entries(data.personalData).forEach(([key, value]) => {
    lines.push(`${key},"${value}"`)
  })
  lines.push('')
  
  // Orders
  lines.push('PEDIDOS')
  lines.push('ID,Lojista,Total,Status,Data')
  data.orders.forEach((order: any) => {
    lines.push(`${order.id},"${order.vendor}",${order.total},${order.status},"${order.createdAt}"`)
  })
  lines.push('')
  
  // Reviews
  lines.push('AVALIAÇÕES')
  lines.push('Lojista,Nota,Comentário,Data')
  data.reviews.forEach((review: any) => {
    lines.push(`"${review.vendor}",${review.rating},"${review.comment || ''}","${review.createdAt}"`)
  })
  
  return lines.join('\n')
}