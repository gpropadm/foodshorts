'use client'

import { useState } from 'react'
import { 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { StatsCard } from './StatsCard'
import { OrdersTable } from './OrdersTable'
import { VendorsTable } from './VendorsTable'
import { FeedItemsTable } from './FeedItemsTable'

const tabs = [
  { id: 'overview', name: 'Visão Geral', icon: TrendingUp },
  { id: 'orders', name: 'Pedidos', icon: ShoppingBag },
  { id: 'vendors', name: 'Lojistas', icon: Store },
  { id: 'feed', name: 'Feed', icon: Eye },
  { id: 'users', name: 'Usuários', icon: Users },
]

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const mockStats = {
    totalUsers: 1247,
    totalVendors: 89,
    totalOrders: 3456,
    totalRevenue: 45678.90,
    ordersToday: 127,
    newUsersToday: 23,
    activeVendors: 67,
    avgOrderValue: 32.45,
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total de Usuários"
                value={mockStats.totalUsers.toLocaleString()}
                icon={Users}
                trend={+12}
                trendLabel="vs mês anterior"
              />
              <StatsCard
                title="Lojistas Ativos"
                value={mockStats.activeVendors.toLocaleString()}
                icon={Store}
                trend={+5}
                trendLabel="vs mês anterior"
              />
              <StatsCard
                title="Pedidos Hoje"
                value={mockStats.ordersToday.toLocaleString()}
                icon={ShoppingBag}
                trend={+8}
                trendLabel="vs ontem"
              />
              <StatsCard
                title="Receita Total"
                value={`R$ ${mockStats.totalRevenue.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2 
                })}`}
                icon={DollarSign}
                trend={+15}
                trendLabel="vs mês anterior"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pedidos Recentes
                </h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Pedido #{1000 + item}
                          </p>
                          <p className="text-xs text-gray-500">
                            Pizza Margherita - R$ 29,90
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Entregue
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Alertas do Sistema
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Backup atrasado
                      </p>
                      <p className="text-xs text-gray-500">
                        Último backup há 2 horas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Sistema operacional
                      </p>
                      <p className="text-xs text-gray-500">
                        Todos os serviços funcionando
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Alto uso de API
                      </p>
                      <p className="text-xs text-gray-500">
                        Google Maps: R$ 180/dia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'orders':
        return <OrdersTable />
      case 'vendors':
        return <VendorsTable />
      case 'feed':
        return <FeedItemsTable />
      case 'users':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Gerenciar Usuários
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500">
                Funcionalidade de usuários em desenvolvimento...
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}