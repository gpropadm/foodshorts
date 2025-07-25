import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'

const fastify = Fastify({
  logger: true
})

async function start() {
  try {
    // Plugins
    await fastify.register(cors, {
      origin: true,
      credentials: true
    })

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'your-secret-key'
    })

    await fastify.register(multipart)

    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute'
    })

    // Routes
    await fastify.register(require('./routes/auth'), { prefix: '/api/auth' })
    await fastify.register(require('./routes/feed'), { prefix: '/api' })
    await fastify.register(require('./routes/orders'), { prefix: '/api' })
    await fastify.register(require('./routes/wallet'), { prefix: '/api' })
    await fastify.register(require('./routes/subscriptions'), { prefix: '/api' })
    await fastify.register(require('./routes/admin'), { prefix: '/api' })
    await fastify.register(require('./routes/support'), { prefix: '/api' })
    await fastify.register(require('./routes/reviews'), { prefix: '/api' })
    await fastify.register(require('./routes/privacy'), { prefix: '/api' })
    await fastify.register(require('./routes/ranking'), { prefix: '/api' })

    // Health check
    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() }
    })

    const port = Number(process.env.PORT) || 3001
    await fastify.listen({ port, host: '0.0.0.0' })
    
    console.log(`🚀 Server running on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()