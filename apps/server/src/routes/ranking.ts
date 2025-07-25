import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authenticateToken } from '../utils/auth'
import {
  getTopVendors,
  getVendorRankingPosition,
  getVendorRankingInsights,
  calculateVendorMetrics,
  updateAllVendorRankings,
  runDailyRankingUpdate
} from '../utils/ranking'

export async function rankingRoutes(fastify: FastifyInstance) {
  // Get Top Vendors (Public)
  fastify.get('/ranking/top', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { limit = 10 } = request.query as { limit?: number }
      
      const topVendors = await getTopVendors(Math.min(limit, 50))
      
      return reply.send({
        vendors: topVendors.map((vendor, index) => ({
          position: index + 1,
          id: vendor.id,
          businessName: vendor.businessName,
          logo: vendor.logo,
          stars: vendor.stars,
          rankingScore: vendor.rankingScore,
          onTimeRate: vendor.onTimeRate,
          volumeScore: vendor.volumeScore,
          plan: vendor.subscription?.plan || 'FREE',
        })),
        generatedAt: new Date().toISOString(),
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Vendor Ranking Position
  fastify.get('/ranking/vendor/:vendorId', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { vendorId } = request.params as { vendorId: string }
      
      const [position, metrics] = await Promise.all([
        getVendorRankingPosition(vendorId),
        calculateVendorMetrics(vendorId)
      ])
      
      return reply.send({
        vendorId,
        ranking: position,
        metrics,
        generatedAt: new Date().toISOString(),
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Vendor not found') {
        return reply.status(404).send({ error: 'Lojista não encontrado' })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Get Vendor Ranking Insights (Vendor Dashboard)
  fastify.get('/ranking/insights/:vendorId', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { vendorId } = request.params as { vendorId: string }
      
      // In real app, verify vendor ownership
      const insights = await getVendorRankingInsights(vendorId)
      
      return reply.send({
        vendorId,
        insights,
        generatedAt: new Date().toISOString(),
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Vendor not found') {
        return reply.status(404).send({ error: 'Lojista não encontrado' })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro internal do servidor' })
    }
  })
  
  // Get Nearby Vendors by Ranking (for discovery)
  fastify.get('/ranking/nearby', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { 
        lat, 
        lng, 
        radius = 5, 
        limit = 20 
      } = request.query as { 
        lat?: number
        lng?: number
        radius?: number
        limit?: number
      }
      
      if (!lat || !lng) {
        return reply.status(400).send({ error: 'Latitude e longitude são obrigatórias' })
      }
      
      // In a real app, you'd use PostGIS or similar for geospatial queries
      // For now, we'll return top vendors with mock distance calculation
      const topVendors = await getTopVendors(limit * 2) // Get more to filter by distance
      
      const nearbyVendors = topVendors.map(vendor => ({
        ...vendor,
        // Mock distance calculation (in real app, use proper geospatial query)
        distance: Math.random() * radius,
        estimatedDeliveryTime: Math.floor(20 + Math.random() * 40), // 20-60 min
      }))
      .filter(vendor => vendor.distance <= radius)
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .slice(0, limit)
      
      return reply.send({
        location: { lat, lng, radius },
        vendors: nearbyVendors,
        count: nearbyVendors.length,
        generatedAt: new Date().toISOString(),
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Admin: Update All Rankings
  fastify.post('/admin/ranking/update', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // In real app, verify admin role
      const result = await runDailyRankingUpdate()
      
      return reply.send({
        message: 'Rankings atualizados com sucesso',
        ...result,
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Admin: Get Ranking Statistics
  fastify.get('/admin/ranking/stats', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      
      const stats = await prisma.vendorProfile.aggregate({
        where: { isActive: true },
        _avg: {
          rankingScore: true,
          stars: true,
          onTimeRate: true,
          volumeScore: true,
        },
        _min: {
          rankingScore: true,
          stars: true,
          onTimeRate: true,
        },
        _max: {
          rankingScore: true,
          stars: true,
          onTimeRate: true,
        },
        _count: {
          id: true,
        }
      })
      
      // Get plan distribution
      const planDistribution = await prisma.vendorProfile.groupBy({
        by: ['subscription'],
        where: { isActive: true },
        _count: { id: true },
      })
      
      // Get score distribution
      const scoreRanges = [
        { min: 0, max: 20, label: '0-20' },
        { min: 20, max: 40, label: '20-40' },
        { min: 40, max: 60, label: '40-60' },
        { min: 60, max: 80, label: '60-80' },
        { min: 80, max: 100, label: '80-100' },
      ]
      
      const scoreDistribution = await Promise.all(
        scoreRanges.map(async range => ({
          range: range.label,
          count: await prisma.vendorProfile.count({
            where: {
              isActive: true,
              rankingScore: {
                gte: range.min,
                lt: range.max,
              }
            }
          })
        }))
      )
      
      return reply.send({
        totalVendors: stats._count.id,
        averages: {
          rankingScore: Math.round((stats._avg.rankingScore || 0) * 100) / 100,
          stars: Math.round((stats._avg.stars || 0) * 10) / 10,
          onTimeRate: Math.round((stats._avg.onTimeRate || 0) * 10) / 10,
          volumeScore: Math.round((stats._avg.volumeScore || 0) * 10) / 10,
        },
        ranges: {
          rankingScore: {
            min: Math.round((stats._min.rankingScore || 0) * 100) / 100,
            max: Math.round((stats._max.rankingScore || 0) * 100) / 100,
          },
          stars: {
            min: Math.round((stats._min.stars || 0) * 10) / 10,
            max: Math.round((stats._max.stars || 0) * 10) / 10,
          },
          onTimeRate: {
            min: Math.round((stats._min.onTimeRate || 0) * 10) / 10,
            max: Math.round((stats._max.onTimeRate || 0) * 10) / 10,
          },
        },
        distributions: {
          scoreDistribution,
          // planDistribution would need proper join with subscription table
        },
        generatedAt: new Date().toISOString(),
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}