import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticateToken } from '../utils/auth'

const prisma = new PrismaClient()

const createReviewSchema = z.object({
  orderId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
})

export async function reviewRoutes(fastify: FastifyInstance) {
  // Create Review
  fastify.post('/reviews', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createReviewSchema.parse(request.body)
      const userId = (request as any).user.userId
      
      // Verify order belongs to user and can be reviewed
      const order = await prisma.order.findFirst({
        where: {
          id: body.orderId,
          userId,
          status: 'DELIVERED',
          review: null, // No existing review
        },
        include: {
          vendor: true,
        }
      })
      
      if (!order) {
        return reply.status(400).send({ 
          error: 'Pedido não encontrado, não entregue ou já avaliado' 
        })
      }
      
      // Create review and update vendor stats
      const review = await prisma.$transaction(async (tx) => {
        const newReview = await tx.review.create({
          data: {
            orderId: body.orderId,
            userId,
            rating: body.rating,
            comment: body.comment,
          },
          include: {
            order: {
              include: {
                vendor: {
                  select: {
                    id: true,
                    businessName: true,
                  }
                }
              }
            }
          }
        })
        
        // Recalculate vendor rating
        const vendorReviews = await tx.review.findMany({
          where: {
            order: {
              vendorId: order.vendorId
            }
          },
          select: { rating: true }
        })
        
        const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length
        
        // Update vendor stats
        await tx.vendorProfile.update({
          where: { id: order.vendorId },
          data: {
            stars: Math.round(avgRating * 10) / 10, // Round to 1 decimal
          }
        })
        
        // Update ranking score (will be recalculated in ranking system)
        await updateVendorRankingScore(tx, order.vendorId)
        
        return newReview
      })
      
      return reply.status(201).send(review)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Reviews for Vendor
  fastify.get('/vendors/:vendorId/reviews', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { vendorId } = request.params as { vendorId: string }
      const { page = 1, limit = 20, rating } = request.query as { 
        page?: number
        limit?: number
        rating?: number
      }
      
      const skip = (page - 1) * limit
      const where: any = {
        order: { vendorId }
      }
      
      if (rating) {
        where.rating = rating
      }
      
      const [reviews, totalCount, stats] = await Promise.all([
        prisma.review.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            },
            order: {
              select: {
                id: true,
                total: true,
                createdAt: true,
                items: {
                  include: {
                    feedItem: {
                      select: {
                        title: true,
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.review.count({ where }),
        prisma.review.groupBy({
          by: ['rating'],
          where: { order: { vendorId } },
          _count: { rating: true },
        })
      ])
      
      // Calculate rating distribution
      const ratingDistribution = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      }
      
      stats.forEach(stat => {
        ratingDistribution[stat.rating as keyof typeof ratingDistribution] = stat._count.rating
      })
      
      const totalReviews = Object.values(ratingDistribution).reduce((a, b) => a + b, 0)
      const avgRating = totalReviews > 0 
        ? Object.entries(ratingDistribution).reduce((sum, [rating, count]) => 
            sum + (parseInt(rating) * count), 0) / totalReviews
        : 0
      
      return reply.send({
        reviews,
        stats: {
          totalReviews,
          avgRating: Math.round(avgRating * 10) / 10,
          distribution: ratingDistribution,
        },
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get User's Reviews
  fastify.get('/reviews/my', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }
      
      const skip = (page - 1) * limit
      
      const reviews = await prisma.review.findMany({
        where: { userId },
        include: {
          order: {
            include: {
              vendor: {
                select: {
                  id: true,
                  businessName: true,
                  logo: true,
                }
              },
              items: {
                include: {
                  feedItem: {
                    select: {
                      title: true,
                      mediaUrl: true,
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
      
      return reply.send({
        reviews,
        pagination: {
          page,
          limit,
          hasMore: reviews.length === limit
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Reviewable Orders (orders that can be reviewed)
  fastify.get('/reviews/pending', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId
      
      const orders = await prisma.order.findMany({
        where: {
          userId,
          status: 'DELIVERED',
          review: null, // No review yet
          deliveredAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              logo: true,
            }
          },
          items: {
            include: {
              feedItem: {
                select: {
                  title: true,
                  mediaUrl: true,
                }
              }
            }
          }
        },
        orderBy: { deliveredAt: 'desc' },
      })
      
      return reply.send({ orders })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Update Review (within 24h)
  fastify.put('/reviews/:id', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const body = z.object({
        rating: z.number().int().min(1).max(5).optional(),
        comment: z.string().max(500).optional(),
      }).parse(request.body)
      
      const userId = (request as any).user.userId
      
      const review = await prisma.review.findFirst({
        where: { 
          id, 
          userId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within 24h
          }
        },
        include: {
          order: {
            select: { vendorId: true }
          }
        }
      })
      
      if (!review) {
        return reply.status(404).send({ 
          error: 'Avaliação não encontrada ou prazo de edição expirado (24h)' 
        })
      }
      
      const updatedReview = await prisma.$transaction(async (tx) => {
        const updated = await tx.review.update({
          where: { id },
          data: body,
          include: {
            order: {
              include: {
                vendor: {
                  select: {
                    id: true,
                    businessName: true,
                  }
                }
              }
            }
          }
        })
        
        // Recalculate vendor rating if rating changed
        if (body.rating) {
          const vendorReviews = await tx.review.findMany({
            where: {
              order: {
                vendorId: review.order.vendorId
              }
            },
            select: { rating: true }
          })
          
          const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length
          
          await tx.vendorProfile.update({
            where: { id: review.order.vendorId },
            data: {
              stars: Math.round(avgRating * 10) / 10,
            }
          })
          
          await updateVendorRankingScore(tx, review.order.vendorId)
        }
        
        return updated
      })
      
      return reply.send(updatedReview)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}

// Helper function to update vendor ranking score
async function updateVendorRankingScore(tx: any, vendorId: string) {
  const vendor = await tx.vendorProfile.findUnique({
    where: { id: vendorId },
    select: {
      stars: true,
      onTimeRate: true,
      volumeScore: true,
      subscription: {
        select: { plan: true }
      }
    }
  })
  
  if (!vendor) return
  
  // Calculate ranking score: (stars*0.6) + (onTime*0.25) + (volume*0.1) + (planBonus)
  const planBonus = vendor.subscription?.plan === 'PREMIUM' ? 10 : 
                   vendor.subscription?.plan === 'PRO' ? 5 : 0
  
  const rankingScore = 
    (vendor.stars * 0.6) + 
    (vendor.onTimeRate * 0.25) + 
    (vendor.volumeScore * 0.1) + 
    planBonus
  
  await tx.vendorProfile.update({
    where: { id: vendorId },
    data: { rankingScore: Math.round(rankingScore * 100) / 100 }
  })
}