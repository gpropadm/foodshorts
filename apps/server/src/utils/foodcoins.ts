import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const COINS_PER_REAL = 1/5 // 1 coin for every R$ 5.00
export const FOODCOIN_VALUE = 0.20 // Each coin is worth R$ 0.20
export const MAX_FOODCOIN_USAGE = 0.30 // Max 30% of order total
export const FOODCOIN_EXPIRY_DAYS = 60

export function calculateOrderCoins(orderTotal: number): number {
  return Math.floor(orderTotal * COINS_PER_REAL)
}

export function calculateTopupCoins(topupValue: number): number {
  // 2x bonus for wallet recharge
  return Math.floor(topupValue * COINS_PER_REAL) * 2
}

export function calculateSubscriptionCoins(subscriptionValue: number): number {
  // 2x bonus for subscriptions
  return Math.floor(subscriptionValue * COINS_PER_REAL) * 2
}

export function calculateMaxUsableCoins(orderTotal: number, availableCoins: number): number {
  const maxCoinsFromTotal = Math.floor((orderTotal * MAX_FOODCOIN_USAGE) / FOODCOIN_VALUE)
  return Math.min(availableCoins, maxCoinsFromTotal)
}

export function calculateFoodcoinDiscount(coinsUsed: number): number {
  return coinsUsed * FOODCOIN_VALUE
}

export async function awardFoodcoins(
  userId: string, 
  coins: number, 
  source: 'order' | 'topup' | 'subscription'
) {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + FOODCOIN_EXPIRY_DAYS)
  
  return await prisma.user.update({
    where: { id: userId },
    data: {
      foodcoins: { increment: coins },
      foodcoinsExpiry: expiryDate,
    }
  })
}

export async function deductFoodcoins(userId: string, coins: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { foodcoins: true, foodcoinsExpiry: true }
  })
  
  if (!user) {
    throw new Error('Usuário não encontrado')
  }
  
  if (user.foodcoins < coins) {
    throw new Error('Foodcoins insuficientes')
  }
  
  // Check if foodcoins are expired
  if (user.foodcoinsExpiry && user.foodcoinsExpiry < new Date()) {
    // Reset expired foodcoins
    await prisma.user.update({
      where: { id: userId },
      data: {
        foodcoins: 0,
        foodcoinsExpiry: null,
      }
    })
    throw new Error('Foodcoins expirados')
  }
  
  return await prisma.user.update({
    where: { id: userId },
    data: {
      foodcoins: { decrement: coins }
    }
  })
}

export async function checkExpiredFoodcoins() {
  const now = new Date()
  
  const expiredUsers = await prisma.user.findMany({
    where: {
      foodcoinsExpiry: { lt: now },
      foodcoins: { gt: 0 }
    }
  })
  
  if (expiredUsers.length > 0) {
    await prisma.user.updateMany({
      where: {
        id: { in: expiredUsers.map(u => u.id) }
      },
      data: {
        foodcoins: 0,
        foodcoinsExpiry: null
      }
    })
    
    console.log(`Reset foodcoins for ${expiredUsers.length} users due to expiry`)
  }
  
  return expiredUsers.length
}