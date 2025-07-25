import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient, ChatStatus, ChatPriority } from '@prisma/client'
import { z } from 'zod'
import { authenticateToken } from '../utils/auth'

const prisma = new PrismaClient()

const createChatSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
})

const sendMessageSchema = z.object({
  content: z.string().min(1),
  isFromUser: z.boolean().default(true),
})

const updateChatSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
})

export async function supportRoutes(fastify: FastifyInstance) {
  // Create Support Chat
  fastify.post('/support/chat', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createChatSchema.parse(request.body)
      const userId = (request as any).user.userId
      
      const chat = await prisma.supportChat.create({
        data: {
          userId,
          subject: body.subject,
          priority: body.priority as ChatPriority,
          messages: {
            create: {
              content: body.message,
              isFromUser: true,
            }
          }
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        }
      })
      
      // Auto-reply with FAQ suggestions (mock)
      const autoReply = generateAutoReply(body.subject, body.message)
      if (autoReply) {
        await prisma.chatMessage.create({
          data: {
            chatId: chat.id,
            content: autoReply,
            isFromUser: false,
          }
        })
      }
      
      return reply.status(201).send(chat)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get User Chats
  fastify.get('/support/chat', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
      
      const skip = (page - 1) * limit
      
      const chats = await prisma.supportChat.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Only last message for preview
          },
          _count: {
            select: { messages: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      })
      
      return reply.send({
        chats: chats.map(chat => ({
          ...chat,
          lastMessage: chat.messages[0] || null,
          messageCount: chat._count.messages,
        })),
        pagination: {
          page,
          limit,
          hasMore: chats.length === limit
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Chat by ID
  fastify.get('/support/chat/:id', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.userId
      
      const chat = await prisma.supportChat.findFirst({
        where: { 
          id, 
          userId // Ensure user can only access their own chats
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        }
      })
      
      if (!chat) {
        return reply.status(404).send({ error: 'Chat não encontrado' })
      }
      
      return reply.send(chat)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Send Message to Chat
  fastify.post('/support/chat/:id/messages', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const body = sendMessageSchema.parse(request.body)
      const userId = (request as any).user.userId
      
      const chat = await prisma.supportChat.findFirst({
        where: { id, userId }
      })
      
      if (!chat) {
        return reply.status(404).send({ error: 'Chat não encontrado' })
      }
      
      const message = await prisma.$transaction(async (tx) => {
        const newMessage = await tx.chatMessage.create({
          data: {
            chatId: id,
            content: body.content,
            isFromUser: body.isFromUser,
          }
        })
        
        // Update chat status and timestamp
        await tx.supportChat.update({
          where: { id },
          data: {
            status: body.isFromUser ? 'IN_PROGRESS' : chat.status,
            updatedAt: new Date(),
          }
        })
        
        return newMessage
      })
      
      return reply.status(201).send(message)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // WhatsApp Integration Webhook (mock)
  fastify.post('/support/whatsapp/webhook', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { from, body: messageBody, type } = request.body as {
        from: string
        body: string
        type: string
      }
      
      // In real app, verify WhatsApp webhook signature
      // and process incoming messages
      
      console.log('WhatsApp message received:', {
        from,
        message: messageBody,
        type,
      })
      
      // Find user by phone and create/update chat
      const user = await prisma.user.findFirst({
        where: { phone: from }
      })
      
      if (user) {
        // Create or find existing WhatsApp chat
        let chat = await prisma.supportChat.findFirst({
          where: {
            userId: user.id,
            subject: 'WhatsApp Support',
            status: { not: 'CLOSED' }
          }
        })
        
        if (!chat) {
          chat = await prisma.supportChat.create({
            data: {
              userId: user.id,
              subject: 'WhatsApp Support',
              priority: 'MEDIUM',
            }
          })
        }
        
        // Add message to chat
        await prisma.chatMessage.create({
          data: {
            chatId: chat.id,
            content: messageBody,
            isFromUser: true,
          }
        })
        
        // Auto-reply or trigger notification to support team
        const autoReply = generateAutoReply('WhatsApp', messageBody)
        if (autoReply) {
          await sendWhatsAppMessage(from, autoReply)
        }
      }
      
      return reply.send({ status: 'ok' })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Admin: Get All Chats
  fastify.get('/admin/support/chats', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        priority 
      } = request.query as { 
        page?: number
        limit?: number
        status?: ChatStatus
        priority?: ChatPriority
      }
      
      const skip = (page - 1) * limit
      const where: any = {}
      
      if (status) where.status = status
      if (priority) where.priority = priority
      
      const chats = await prisma.supportChat.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          vendor: {
            select: {
              id: true,
              businessName: true,
              email: true,
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { messages: true }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { updatedAt: 'desc' }
        ],
        skip,
        take: limit,
      })
      
      return reply.send({
        chats,
        pagination: {
          page,
          limit,
          hasMore: chats.length === limit
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Admin: Update Chat
  fastify.put('/admin/support/chats/:id', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const body = updateChatSchema.parse(request.body)
      
      const chat = await prisma.supportChat.update({
        where: { id },
        data: body,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        }
      })
      
      return reply.send(chat)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}

// Helper functions
function generateAutoReply(subject: string, message: string): string | null {
  const lowerMessage = message.toLowerCase()
  const lowerSubject = subject.toLowerCase()
  
  // FAQ Auto-responses
  if (lowerMessage.includes('pedido') && lowerMessage.includes('atras')) {
    return `Olá! Entendo sua preocupação com o atraso do pedido. 
    
Nossa equipe está verificando o status com o restaurante. Você pode acompanhar em tempo real pelo app.

Se precisar de mais ajuda, nosso atendimento humano responderá em breve! 🍕`
  }
  
  if (lowerMessage.includes('reembolso') || lowerMessage.includes('devol')) {
    return `Sobre reembolsos:

• Cancelamentos: até 15min após o pedido
• Problemas com qualidade: análise em até 24h
• Reembolso automático em 3-5 dias úteis

Posso ajudar com mais alguma coisa? 💳`
  }
  
  if (lowerMessage.includes('foodcoin') || lowerMessage.includes('ponto')) {
    return `Sobre Foodcoins:

• Ganhe 1 coin a cada R$ 5,00 em pedidos
• Bônus 2x em recargas da carteira
• Use até 30% do valor do pedido
• Válidos por 60 dias

Aproveite suas moedas! 🪙`
  }
  
  // Default greeting
  if (lowerMessage.includes('ola') || lowerMessage.includes('oi') || subject === 'WhatsApp Support') {
    return `Olá! Bem-vindo ao suporte FoodShorts! 👋

Como posso ajudar você hoje?

• Problemas com pedidos
• Dúvidas sobre Foodcoins  
• Questões de pagamento
• Outras dúvidas

Nossa equipe responderá o mais rápido possível!`
  }
  
  return null
}

async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  // Mock WhatsApp Cloud API integration
  console.log(`Sending WhatsApp message to ${to}:`, message)
  
  // In real app:
  // const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     messaging_product: 'whatsapp',
  //     to,
  //     text: { body: message }
  //   })
  // })
}