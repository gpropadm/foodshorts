import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient, SubscriptionPlan, AddonType } from '@prisma/client'
import { z } from 'zod'
import { authenticateToken } from '../utils/auth'
import { calculateSubscriptionCoins, awardFoodcoins } from '../utils/foodcoins'

const prisma = new PrismaClient()

const createSubscriptionSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'PREMIUM']),
  paymentMethodId: z.string().optional(),
})

const createAddonSchema = z.object({
  addon: z.enum(['SOCIAL_BOOST']),
  paymentMethodId: z.string().optional(),
})

const subscriptionPrices = {
  FREE: 0,
  PRO: 149,
  PREMIUM: 0, // Negociável
}

const addonPrices = {
  SOCIAL_BOOST: 299,
}

const commissionRates = {
  FREE: 0.18,
  PRO: 0.08,
  PREMIUM: 0.05, // Negociável
}

export async function subscriptionRoutes(fastify: FastifyInstance) {
  // Get Vendor Subscription Status
  fastify.get('/subscriptions/vendor/:vendorId', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { vendorId } = request.params as { vendorId: string }
      
      const vendor = await prisma.vendorProfile.findUnique({
        where: { id: vendorId },
        include: {
          subscription: true,
          addonSubscriptions: {
            where: { status: 'ACTIVE' }
          }
        }
      })
      
      if (!vendor) {
        return reply.status(404).send({ error: 'Lojista não encontrado' })
      }
      
      return reply.send({
        vendor: {
          id: vendor.id,
          businessName: vendor.businessName,
          commissionRate: vendor.commissionRate,
        },
        subscription: vendor.subscription || {
          plan: 'FREE',
          status: 'ACTIVE',
          currentPeriodEnd: null,
        },
        addons: vendor.addonSubscriptions,
        availablePlans: {
          FREE: {
            price: subscriptionPrices.FREE,
            commission: commissionRates.FREE,
            features: ['Feed básico', 'Suporte por email']
          },
          PRO: {
            price: subscriptionPrices.PRO,
            commission: commissionRates.PRO,
            trial: 14,
            features: ['Feed prioritário', 'Analytics', 'Suporte telefônico']
          },
          PREMIUM: {
            price: 'Negociável',
            commission: commissionRates.PREMIUM,
            features: ['Tudo do PRO', 'Manager dedicado', 'API customizada']
          }
        },
        availableAddons: {
          SOCIAL_BOOST: {
            price: addonPrices.SOCIAL_BOOST,
            features: ['3 posts/semana FB/IG', '1 Ads/mês', 'SLA 4h']
          }
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Create/Update Vendor Subscription
  fastify.post('/subscriptions/vendor/:vendorId', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { vendorId } = request.params as { vendorId: string }
      const body = createSubscriptionSchema.parse(request.body)
      
      const vendor = await prisma.vendorProfile.findUnique({
        where: { id: vendorId },
        include: { subscription: true }
      })
      
      if (!vendor) {
        return reply.status(404).send({ error: 'Lojista não encontrado' })
      }
      
      // Calculate period end
      const currentPeriodEnd = new Date()
      if (body.plan === 'PRO') {
        // Check if trial available
        const isTrialEligible = !vendor.subscription || vendor.subscription.trialEnd === null
        
        if (isTrialEligible) {
          currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 14) // 14 day trial
        } else {
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1) // Monthly billing
        }
      } else if (body.plan === 'PREMIUM') {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
      }
      
      const subscription = await prisma.$transaction(async (tx) => {
        // Update or create subscription
        const subscriptionData = {
          vendorId,
          plan: body.plan as SubscriptionPlan,
          status: 'ACTIVE' as const,
          currentPeriodEnd,
          trialEnd: body.plan === 'PRO' && (!vendor.subscription || vendor.subscription.trialEnd === null) 
            ? currentPeriodEnd 
            : vendor.subscription?.trialEnd,
          stripeSubscriptionId: body.paymentMethodId, // In real app, create Stripe subscription
        }
        
        const newSubscription = vendor.subscription 
          ? await tx.vendorSubscription.update({
              where: { vendorId },
              data: subscriptionData
            })
          : await tx.vendorSubscription.create({
              data: subscriptionData
            })
        
        // Update vendor commission rate
        await tx.vendorProfile.update({
          where: { id: vendorId },
          data: {
            commissionRate: commissionRates[body.plan]
          }
        })
        
        // Award foodcoins for paid plans
        if (body.plan !== 'FREE') {
          const price = subscriptionPrices[body.plan]
          if (price > 0) {
            const coinsEarned = calculateSubscriptionCoins(price)
            await awardFoodcoins(vendorId, coinsEarned, 'subscription')
          }
        }
        
        return newSubscription
      })
      
      return reply.status(201).send({
        subscription,
        message: body.plan === 'PRO' && subscription.trialEnd 
          ? 'Trial de 14 dias iniciado com sucesso!' 
          : 'Assinatura ativada com sucesso!'
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Add Addon Subscription
  fastify.post('/subscriptions/vendor/:vendorId/addons', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { vendorId } = request.params as { vendorId: string }
      const body = createAddonSchema.parse(request.body)
      
      const vendor = await prisma.vendorProfile.findUnique({
        where: { id: vendorId }
      })
      
      if (!vendor) {
        return reply.status(404).send({ error: 'Lojista não encontrado' })
      }
      
      // Check if addon already exists
      const existingAddon = await prisma.vendorAddonSubscription.findFirst({
        where: {
          vendorId,
          addon: body.addon as AddonType,
          status: 'ACTIVE'
        }
      })
      
      if (existingAddon) {
        return reply.status(400).send({ error: 'Add-on já ativo para este lojista' })
      }
      
      const currentPeriodEnd = new Date()
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
      
      const addonSubscription = await prisma.$transaction(async (tx) => {
        const newAddon = await tx.vendorAddonSubscription.create({
          data: {
            vendorId,
            addon: body.addon as AddonType,
            status: 'ACTIVE',
            currentPeriodEnd,
            stripeSubscriptionId: body.paymentMethodId, // In real app, create Stripe subscription
          }
        })
        
        // Award foodcoins for addon
        const price = addonPrices[body.addon as keyof typeof addonPrices]
        const coinsEarned = calculateSubscriptionCoins(price)
        await awardFoodcoins(vendorId, coinsEarned, 'subscription')
        
        return newAddon
      })
      
      return reply.status(201).send({
        addon: addonSubscription,
        message: 'Add-on Social Boost ativado com sucesso!'
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Cancel Subscription
  fastify.delete('/subscriptions/vendor/:vendorId', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { vendorId } = request.params as { vendorId: string }
      
      const subscription = await prisma.vendorSubscription.findUnique({
        where: { vendorId }
      })
      
      if (!subscription) {
        return reply.status(404).send({ error: 'Assinatura não encontrada' })
      }
      
      await prisma.$transaction(async (tx) => {
        // Cancel subscription (keep until period end)
        await tx.vendorSubscription.update({
          where: { vendorId },
          data: { status: 'CANCELLED' }
        })
        
        // Revert to FREE plan commission
        await tx.vendorProfile.update({
          where: { id: vendorId },
          data: { commissionRate: commissionRates.FREE }
        })
      })
      
      return reply.send({
        message: 'Assinatura cancelada. Permanecerá ativa até o final do período atual.'
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  
  // Cancel Addon
  fastify.delete('/subscriptions/vendor/:vendorId/addons/:addonId', {
    preHandler: authenticateToken
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { vendorId, addonId } = request.params as { vendorId: string; addonId: string }
      
      const addon = await prisma.vendorAddonSubscription.findFirst({
        where: {
          id: addonId,
          vendorId,
          status: 'ACTIVE'
        }
      })
      
      if (!addon) {
        return reply.status(404).send({ error: 'Add-on não encontrado' })
      }
      
      await prisma.vendorAddonSubscription.update({
        where: { id: addonId },
        data: { status: 'CANCELLED' }
      })
      
      return reply.send({
        message: 'Add-on cancelado. Permanecerá ativo até o final do período atual.'
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}