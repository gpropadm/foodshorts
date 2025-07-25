import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface RankingMetrics {
  stars: number
  onTimeRate: number
  volumeScore: number
  planBonus: number
}

export interface RankingWeights {
  stars: number
  onTime: number
  volume: number
}

export const RANKING_WEIGHTS: RankingWeights = {
  stars: 0.6,   // 60% weight for customer satisfaction
  onTime: 0.25, // 25% weight for delivery performance
  volume: 0.1,  // 10% weight for order volume
  // Plan bonus is added separately: PRO +5, PREMIUM +10
}

// Calculate ranking score based on spec formula
export function calculateRankingScore(metrics: RankingMetrics): number {
  const baseScore = 
    (metrics.stars * RANKING_WEIGHTS.stars) + 
    (metrics.onTimeRate * RANKING_WEIGHTS.onTime) + 
    (metrics.volumeScore * RANKING_WEIGHTS.volume)
  
  return Math.round((baseScore + metrics.planBonus) * 100) / 100
}

// Update all vendor ranking scores
export async function updateAllVendorRankings(): Promise<number> {
  const vendors = await prisma.vendorProfile.findMany({
    where: { isActive: true },
    include: {
      subscription: {
        select: { plan: true }
      }
    }
  })
  
  let updatedCount = 0
  
  for (const vendor of vendors) {
    try {
      const metrics = await calculateVendorMetrics(vendor.id)
      const rankingScore = calculateRankingScore(metrics)
      
      await prisma.vendorProfile.update({
        where: { id: vendor.id },
        data: {
          stars: metrics.stars,
          onTimeRate: metrics.onTimeRate,
          volumeScore: metrics.volumeScore,
          rankingScore,
        }
      })
      
      updatedCount++
    } catch (error) {
      console.error(`Error updating ranking for vendor ${vendor.id}:`, error)
    }
  }
  
  return updatedCount
}

// Calculate metrics for a specific vendor
export async function calculateVendorMetrics(vendorId: string): Promise<RankingMetrics> {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Get vendor with subscription info
  const vendor = await prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    include: {
      subscription: {
        select: { plan: true }
      }
    }
  })
  
  if (!vendor) {
    throw new Error('Vendor not found')
  }
  
  // Calculate star rating from reviews
  const reviewStats = await prisma.review.aggregate({
    where: {
      order: { vendorId }
    },
    _avg: { rating: true },
    _count: { rating: true }
  })
  
  const stars = reviewStats._avg.rating || 0
  
  // Calculate on-time delivery rate (last 30 days)
  const deliveryStats = await prisma.deliveryMetric.findMany({
    where: {
      order: { 
        vendorId,
        createdAt: { gte: thirtyDaysAgo }
      }
    },
    select: { isOnTime: true }
  })
  
  const onTimeDeliveries = deliveryStats.filter(d => d.isOnTime === true).length
  const totalDeliveries = deliveryStats.length
  const onTimeRate = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0
  
  // Calculate volume score (orders in last 30 days, normalized to 0-100)
  const orderCount = await prisma.order.count({
    where: {
      vendorId,
      createdAt: { gte: thirtyDaysAgo },
      status: 'DELIVERED'
    }
  })
  
  // Normalize volume: 0-10 orders = 0-20, 11-50 = 21-60, 51+ = 61-100
  let volumeScore = 0
  if (orderCount <= 10) {
    volumeScore = (orderCount / 10) * 20
  } else if (orderCount <= 50) {
    volumeScore = 20 + ((orderCount - 10) / 40) * 40
  } else {
    volumeScore = 60 + Math.min(((orderCount - 50) / 50) * 40, 40)
  }
  
  // Plan bonus
  const planBonus = vendor.subscription?.plan === 'PREMIUM' ? 10 : 
                   vendor.subscription?.plan === 'PRO' ? 5 : 0
  
  return {
    stars: Math.round(stars * 10) / 10,
    onTimeRate: Math.round(onTimeRate * 10) / 10,
    volumeScore: Math.round(volumeScore * 10) / 10,
    planBonus,
  }
}

// Get top vendors by ranking
export async function getTopVendors(limit: number = 10) {
  return await prisma.vendorProfile.findMany({
    where: { isActive: true },
    orderBy: { rankingScore: 'desc' },
    take: limit,
    select: {
      id: true,
      businessName: true,
      logo: true,
      stars: true,
      rankingScore: true,
      onTimeRate: true,
      volumeScore: true,
      subscription: {
        select: { plan: true }
      }
    }
  })
}

// Get vendor ranking position
export async function getVendorRankingPosition(vendorId: string): Promise<{
  position: number
  totalVendors: number
  percentile: number
}> {
  const vendor = await prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    select: { rankingScore: true }
  })
  
  if (!vendor) {
    throw new Error('Vendor not found')
  }
  
  const [higherRanked, totalVendors] = await Promise.all([
    prisma.vendorProfile.count({
      where: {
        isActive: true,
        rankingScore: { gt: vendor.rankingScore }
      }
    }),
    prisma.vendorProfile.count({
      where: { isActive: true }
    })
  ])
  
  const position = higherRanked + 1
  const percentile = totalVendors > 0 ? Math.round(((totalVendors - position) / totalVendors) * 100) : 0
  
  return {
    position,
    totalVendors,
    percentile,
  }
}

// Update delivery metrics after order completion
export async function updateDeliveryMetrics(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      vendorId: true,
      estimatedTime: true,
      deliveredAt: true,
      createdAt: true,
    }
  })
  
  if (!order || !order.deliveredAt) {
    return
  }
  
  const actualTime = Math.round((order.deliveredAt.getTime() - order.createdAt.getTime()) / (1000 * 60))
  const isOnTime = order.estimatedTime ? actualTime <= order.estimatedTime : true
  
  // Create or update delivery metric
  await prisma.deliveryMetric.upsert({
    where: { orderId },
    create: {
      orderId,
      estimatedTime: order.estimatedTime || 30,
      actualTime,
      isOnTime,
    },
    update: {
      actualTime,
      isOnTime,
    }
  })
  
  // Update vendor metrics immediately
  try {
    const metrics = await calculateVendorMetrics(order.vendorId)
    const rankingScore = calculateRankingScore(metrics)
    
    await prisma.vendorProfile.update({
      where: { id: order.vendorId },
      data: {
        onTimeRate: metrics.onTimeRate,
        volumeScore: metrics.volumeScore,
        rankingScore,
      }
    })
  } catch (error) {
    console.error('Error updating vendor metrics:', error)
  }
}

// Run daily ranking updates (cron job)
export async function runDailyRankingUpdate(): Promise<{
  updatedVendors: number
  timestamp: Date
}> {
  console.log('Starting daily ranking update...')
  
  const updatedVendors = await updateAllVendorRankings()
  const timestamp = new Date()
  
  console.log(`Daily ranking update completed: ${updatedVendors} vendors updated`)
  
  return {
    updatedVendors,
    timestamp,
  }
}

// Get ranking insights for a vendor
export async function getVendorRankingInsights(vendorId: string) {
  const [metrics, position, competitors] = await Promise.all([
    calculateVendorMetrics(vendorId),
    getVendorRankingPosition(vendorId),
    prisma.vendorProfile.findMany({
      where: {
        isActive: true,
        id: { not: vendorId }
      },
      orderBy: { rankingScore: 'desc' },
      take: 5,
      select: {
        businessName: true,
        rankingScore: true,
        stars: true,
        onTimeRate: true,
      }
    })
  ])
  
  const rankingScore = calculateRankingScore(metrics)
  
  // Calculate improvement suggestions
  const suggestions = []
  
  if (metrics.stars < 4.0) {
    suggestions.push({
      area: 'Avaliações',
      current: metrics.stars,
      target: 4.5,
      impact: 'Alto',
      actions: ['Melhore a qualidade dos pratos', 'Treine a equipe de atendimento', 'Solicite feedback dos clientes']
    })
  }
  
  if (metrics.onTimeRate < 85) {
    suggestions.push({
      area: 'Pontualidade',
      current: `${metrics.onTimeRate}%`,
      target: '90%+',
      impact: 'Médio',
      actions: ['Otimize o tempo de preparo', 'Integre melhor com entregadores', 'Ajuste estimativas de tempo']
    })
  }
  
  if (metrics.volumeScore < 40) {
    suggestions.push({
      area: 'Volume de Pedidos',
      current: metrics.volumeScore,
      target: 60,
      impact: 'Baixo',
      actions: ['Crie promoções atrativas', 'Melhore fotos dos produtos', 'Expanda cardápio']
    })
  }
  
  return {
    currentRanking: {
      score: rankingScore,
      position: position.position,
      percentile: position.percentile,
    },
    metrics,
    competitors: competitors.slice(0, 3),
    suggestions,
  }
}