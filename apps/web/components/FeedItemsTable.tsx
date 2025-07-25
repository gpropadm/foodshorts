'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2, Play } from 'lucide-react'
import Image from 'next/image'

const mockFeedItems = [
  {
    id: '1',
    title: 'Pizza Margherita Especial',
    description: 'Pizza artesanal com molho de tomate, mussarela e manjericão fresco',
    price: 29.90,
    originalPrice: 35.90,
    mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    mediaType: 'image',
    vendor: 'Pizza Express',
    views: 1847,
    likes: 234,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Burger Gourmet Premium',
    description: 'Hambúrguer artesanal com carne angus, queijo cheddar e bacon',
    price: 32.50,
    originalPrice: null,
    mediaUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    mediaType: 'video',
    vendor: 'Burger King',
    views: 3241,
    likes: 456,
    isActive: true,
    createdAt: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    title: 'Combo Sushi Premium',
    description: 'Seleção especial com salmão, atum e peixe branco',
    price: 78.90,
    originalPrice: 89.90,
    mediaUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
    mediaType: 'image',
    vendor: 'Sushi House',
    views: 892,
    likes: 127,
    isActive: true,
    createdAt: '2024-01-15T08:45:00Z',
  },
  {
    id: '4',
    title: 'Tacos Mexicanos Tradicionais',
    description: 'Trio de tacos com carne, frango e carnitas',
    price: 28.90,
    originalPrice: null,
    mediaUrl: 'https://images.unsplash.com/photo-1565299585323-38174c5b0b3d?w=400',
    mediaType: 'video',
    vendor: 'Taco Bell',
    views: 654,
    likes: 89,
    isActive: false,
    createdAt: '2024-01-15T07:20:00Z',
  },
]

export function FeedItemsTable() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Gerenciar Feed
        </h3>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Filtros
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            Moderar Conteúdo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conteúdo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lojista
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engajamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publicado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockFeedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 relative">
                      <Image
                        src={item.mediaUrl}
                        alt={item.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                      {item.mediaType === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white bg-black bg-opacity-50 rounded-full p-1" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {item.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {item.mediaType === 'video' ? 'Vídeo' : 'Imagem'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.vendor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.price)}
                  </div>
                  {item.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatCurrency(item.originalPrice)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.views.toLocaleString()} visualizações
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.likes.toLocaleString()} curtidas
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedItem(item.id)}
                    className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  <button className="text-red-600 hover:text-red-900 inline-flex items-center">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remover
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
            <span className="font-medium">{mockFeedItems.length}</span> de{' '}
            <span className="font-medium">{mockFeedItems.length}</span> itens
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