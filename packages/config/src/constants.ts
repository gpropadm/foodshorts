// Application constants

export const APP_CONFIG = {
  name: 'FoodShorts',
  version: '1.0.0',
  description: 'App de delivery com feed de vídeos curtos',
  website: 'https://foodshorts.com',
  supportEmail: 'suporte@foodshorts.com',
  privacyEmail: 'privacidade@foodshorts.com',
}

export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
}

export const FOODCOINS = {
  COINS_PER_REAL: 0.2, // 1 coin per R$ 5.00
  COIN_VALUE: 0.20, // Each coin is worth R$ 0.20
  MAX_USAGE_PERCENTAGE: 0.30, // Max 30% of order total
  EXPIRY_DAYS: 60,
  TOPUP_BONUS_MULTIPLIER: 2, // 2x coins for wallet topup
  SUBSCRIPTION_BONUS_MULTIPLIER: 2, // 2x coins for subscriptions
}

export const WALLET = {
  MIN_TOPUP_AMOUNT: 5.00,
  MAX_TOPUP_AMOUNT: 1000.00,
  TOPUP_BONUS_PERCENTAGE: 0.05, // 5% bonus
}

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Grátis',
    price: 0,
    commission: 0.18, // 18%
    features: [
      'Feed básico',
      'Suporte por email',
      'Até 10 produtos',
    ],
  },
  PRO: {
    name: 'Profissional',
    price: 149,
    commission: 0.08, // 8%
    trialDays: 14,
    features: [
      'Feed prioritário',
      'Analytics avançadas',
      'Suporte telefônico',
      'Produtos ilimitados',
      'Destaque na busca',
    ],
  },
  PREMIUM: {
    name: 'Premium',
    price: 'Negociável',
    commission: 0.05, // 5%
    features: [
      'Tudo do PRO',
      'Manager dedicado',
      'API customizada',
      'Integração personalizada',
      'SLA premium',
    ],
  },
}

export const ADDONS = {
  SOCIAL_BOOST: {
    name: 'Social Boost',
    price: 299,
    features: [
      '3 posts por semana no Facebook/Instagram',
      '1 campanha de ads por mês',
      'SLA de 4 horas',
      'Relatórios de performance',
    ],
  },
}

export const RANKING_WEIGHTS = {
  STARS: 0.6, // 60% weight
  ON_TIME: 0.25, // 25% weight
  VOLUME: 0.1, // 10% weight
  // Plan bonuses: PRO +5, PREMIUM +10
}

export const DELIVERY = {
  DEFAULT_FEE: 5.00,
  FREE_DELIVERY_THRESHOLD: 30.00,
  MAX_DELIVERY_DISTANCE: 15, // km
  DEFAULT_ESTIMATED_TIME: 30, // minutes
}

export const ORDERS = {
  CANCELLATION_WINDOW: 15, // minutes
  REVIEW_WINDOW: 30, // days
  REVIEW_EDIT_WINDOW: 24, // hours
}

export const MEDIA = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  SUPPORTED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  MAX_VIDEO_DURATION: 60, // seconds
  IMAGE_QUALITY: 0.8,
  THUMBNAIL_SIZE: { width: 400, height: 300 },
}

export const CHAT = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_CHAT_HISTORY: 100,
  AUTO_CLOSE_DAYS: 7,
}

export const MAPS = {
  DEFAULT_ZOOM: 15,
  MARKER_CLUSTER_MAX_ZOOM: 12,
  GEOLOCATION_TIMEOUT: 10000, // 10 seconds
  GEOLOCATION_MAX_AGE: 300000, // 5 minutes
}

export const NOTIFICATIONS = {
  TYPES: {
    ORDER_CONFIRMED: 'order_confirmed',
    ORDER_PREPARING: 'order_preparing',
    ORDER_OUT_FOR_DELIVERY: 'order_out_for_delivery',
    ORDER_DELIVERED: 'order_delivered',
    ORDER_CANCELLED: 'order_cancelled',
    PROMOTION: 'promotion',
    SYSTEM: 'system',
    CHAT_MESSAGE: 'chat_message',
  },
}

export const FEATURE_FLAGS = {
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_DARK_MODE: true,
  ENABLE_LOCATION_TRACKING: true,
  ENABLE_BIOMETRIC_AUTH: false,
}

export const PERFORMANCE = {
  BUNDLE_SIZE_LIMIT: 4 * 1024 * 1024, // 4MB
  FCP_THRESHOLD: 200, // ms
  CACHE_EXPIRY: 5 * 60 * 1000, // 5 minutes
  OFFLINE_CACHE_SIZE: 50, // posts
}

export const SECURITY = {
  JWT_EXPIRY: 15 * 60, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_COOLDOWN: 15 * 60, // 15 minutes
  PASSWORD_MIN_LENGTH: 6,
}

export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 100,
  LOGIN_ATTEMPTS_PER_HOUR: 10,
  CHAT_MESSAGES_PER_MINUTE: 10,
  REVIEW_SUBMISSIONS_PER_DAY: 5,
}

export const BACKUP_CONFIG = {
  RPO_MINUTES: 30, // Recovery Point Objective
  RTO_HOURS: 2, // Recovery Time Objective
  BACKUP_FREQUENCY: '0 2 * * *', // Daily at 2 AM
  RETENTION_DAYS: 30,
}

export const MONITORING = {
  HEALTH_CHECK_INTERVAL: 30, // seconds
  ALERT_THRESHOLDS: {
    ERROR_RATE: 0.05, // 5%
    RESPONSE_TIME: 1000, // ms
    CPU_USAGE: 80, // %
    MEMORY_USAGE: 85, // %
    DISK_USAGE: 90, // %
  },
  COST_ALERTS: {
    GOOGLE_MAPS_DAILY: 200, // R$
    OPENAI_DAILY: 100, // R$
    AWS_MONTHLY: 1000, // R$
  },
}

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  CEP: /^\d{5}-\d{3}$/,
}

export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Validation
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  
  // Business Logic
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  VENDOR_INACTIVE: 'VENDOR_INACTIVE',
  ITEM_OUT_OF_STOCK: 'ITEM_OUT_OF_STOCK',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
}

export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Pedido realizado com sucesso!',
  REVIEW_SUBMITTED: 'Avaliação enviada com sucesso!',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  WALLET_TOPPED_UP: 'Carteira recarregada com sucesso!',
  SUBSCRIPTION_ACTIVATED: 'Assinatura ativada com sucesso!',
}