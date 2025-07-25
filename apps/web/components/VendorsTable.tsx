'use client'

import { useState } from 'react'
import { Eye, Edit, Star } from 'lucide-react'

const mockVendors = [
  {
    id: '1',
    businessName: 'Pizza Express',
    email: 'contato@pizzaexpress.com',
    phone: '(11) 99999-1111',
    plan: 'PRO',
    commissionRate: 8,
    stars: 4.8,
    rankingScore: 95,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    businessName: 'Burger King',
    email: 'admin@burgerking.com',
    phone: '(11) 88888-2222',
    plan: 'FREE',
    commissionRate: 18,
    stars: 4.2,
    rankingScore: 78,
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '3',
    businessName: 'Sushi House',
    email: 'sushi@house.com',
    phone: '(11) 77777-3333',
    plan: 'PREMIUM',
    commissionRate: 5,
    stars: 4.9,
    rankingScore: 98,
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '4',
    businessName: 'Taco Bell',
    email: 'info@tacobell.com',
    phone: '(11) 66666-4444',
    plan: 'PRO',
    commissionRate: 8,
    stars: 4.1,
    rankingScore: 72,
    isActive: false,
    createdAt: '2024-01-12T00:00:00Z',
  },
]

const planColors = {
  FREE: 'bg-gray-100 text-gray-800',
  PRO: 'bg-blue-100 text-blue-800',
  PREMIUM: 'bg-purple-100 text-purple-800',
}

export function VendorsTable() {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Gerenciar Lojistas
        </h3>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            Novo Lojista
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lojista
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plano
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comissão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avaliação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockVendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-800">
                          {vendor.businessName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {vendor.businessName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Desde {formatDate(vendor.createdAt)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vendor.email}</div>
                  <div className="text-sm text-gray-500">{vendor.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    planColors[vendor.plan as keyof typeof planColors]
                  }`}>
                    {vendor.plan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.commissionRate}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-900">
                      {vendor.stars}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.rankingScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    vendor.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vendor.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedVendor(vendor.id)}
                    className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">1</span> a{' '}
            <span className="font-medium">{mockVendors.length}</span> de{' '}
            <span className="font-medium">{mockVendors.length}</span> lojistas
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}