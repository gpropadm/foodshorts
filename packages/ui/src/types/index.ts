// Common types shared across applications

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  walletCredit: number
  foodcoins: number
  foodcoinsExpiry?: Date
  createdAt: Date
}

export interface VendorProfile {
  id: string
  businessName: string
  description?: string
  logo?: string
  banner?: string
  phone: string
  address: string
  latitude: number
  longitude: number
  isActive: boolean
  commissionRate: number
  rankingScore: number
  stars: number
  onTimeRate: number
  volumeScore: number
}

export interface FeedItem {
  id: string
  vendorId: string
  title: string
  description?: string
  price: number
  originalPrice?: number
  mediaUrl: string
  mediaType: 'image' | 'video'
  isActive: boolean
  views: number
  likes: number
  createdAt: Date
  vendor?: VendorProfile
}

export interface Order {
  id: string
  userId: string
  vendorId: string
  status: OrderStatus
  total: number
  deliveryFee: number
  foodcoinsUsed: number
  walletCreditUsed: number
  deliveryAddress: string
  deliveryLatitude: number
  deliveryLongitude: number
  estimatedTime?: number
  deliveredAt?: Date
  createdAt: Date
  items: OrderItem[]
  vendor?: VendorProfile
}

export interface OrderItem {
  id: string
  orderId: string
  feedItemId: string
  quantity: number
  price: number
  feedItem?: FeedItem
}

export interface Review {
  id: string
  orderId: string
  userId: string
  rating: number
  comment?: string
  createdAt: Date
  order?: Order
  user?: User
}

export interface SupportChat {
  id: string
  userId?: string
  vendorId?: string
  subject: string
  status: ChatStatus
  priority: ChatPriority
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
  user?: User
  vendor?: VendorProfile
}

export interface ChatMessage {
  id: string
  chatId: string
  content: string
  isFromUser: boolean
  createdAt: Date
}

export interface VendorSubscription {
  id: string
  vendorId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodEnd: Date
  trialEnd?: Date
  createdAt: Date
}

export interface VendorAddonSubscription {
  id: string
  vendorId: string
  addon: AddonType
  status: SubscriptionStatus
  currentPeriodEnd: Date
  createdAt: Date
}

// Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
}

export enum AddonType {
  SOCIAL_BOOST = 'SOCIAL_BOOST',
}

export enum ChatStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum ChatPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total?: number
    totalPages?: number
    hasMore: boolean
  }
}

// Component props
export interface FeedCardProps {
  item: FeedItem
  onPress?: (item: FeedItem) => void
  onAddToCart?: (item: FeedItem) => void
}

export interface OrderCardProps {
  order: Order
  onPress?: (order: Order) => void
  onTrack?: (order: Order) => void
  onReview?: (order: Order) => void
}

export interface VendorCardProps {
  vendor: VendorProfile
  onPress?: (vendor: VendorProfile) => void
  distance?: number
  estimatedTime?: number
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
}

export interface CreateOrderForm {
  vendorId: string
  items: Array<{
    feedItemId: string
    quantity: number
  }>
  deliveryAddress: string
  deliveryLatitude: number
  deliveryLongitude: number
  foodcoinsToUse?: number
  walletCreditToUse?: number
}

export interface CreateReviewForm {
  orderId: string
  rating: number
  comment?: string
}

// Utility types
export type ThemeMode = 'light' | 'dark'

export interface Location {
  latitude: number
  longitude: number
  address?: string
}

export interface Notification {
  id: string
  title: string
  body: string
  type: 'order' | 'promotion' | 'system'
  data?: Record<string, any>
  createdAt: Date
  read: boolean
}