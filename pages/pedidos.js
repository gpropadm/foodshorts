import { useState } from 'react'
import Layout from '../components/Layout'

export default function Pedidos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')

  const orders = [
    {
      id: '#12345',
      customer: 'João Silva',
      restaurant: 'Pizza Express',
      items: ['Pizza Margherita', 'Refrigerante 2L'],
      total: 'R$ 45,90',
      status: 'Entregue',
      paymentMethod: 'Cartão',
      address: 'Rua A, 123 - Centro',
      orderTime: '14:30',
      deliveryTime: '15:15',
      date: '26/01/2024'
    },
    {
      id: '#12346',
      customer: 'Maria Santos',
      restaurant: 'Burger King',
      items: ['Big Burger', 'Batata Frita', 'Coca-Cola'],
      total: 'R$ 32,50',
      status: 'A caminho',
      paymentMethod: 'PIX',
      address: 'Av. B, 456 - Jardins',
      orderTime: '15:45',
      deliveryTime: '16:30',
      date: '26/01/2024'
    },
    {
      id: '#12347',
      customer: 'Pedro Costa',
      restaurant: 'Sushi Bar',
      items: ['Combo Sushi', 'Temaki Salmão'],
      total: 'R$ 89,90',
      status: 'Preparando',
      paymentMethod: 'Dinheiro',
      address: 'Rua C, 789 - Vila Nova',
      orderTime: '16:00',
      deliveryTime: '17:00',
      date: '26/01/2024'
    },
    {
      id: '#12348',
      customer: 'Ana Lima',
      restaurant: 'Taco Bell',
      items: ['Taco Mexicano', 'Burrito'],
      total: 'R$ 28,90',
      status: 'Confirmado',
      paymentMethod: 'Cartão',
      address: 'Rua D, 321 - Centro',
      orderTime: '16:15',
      deliveryTime: '17:15',
      date: '26/01/2024'
    },
    {
      id: '#12349',
      customer: 'Carlos Silva',
      restaurant: 'Pizza Express',
      items: ['Pizza Calabresa', 'Pizza Portuguesa'],
      total: 'R$ 67,80',
      status: 'Cancelado',
      paymentMethod: 'PIX',
      address: 'Av. E, 654 - Bairro Alto',
      orderTime: '13:20',
      deliveryTime: '-',
      date: '26/01/2024'
    }
  ]

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'todos' || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmado': return { bg: '#dbeafe', color: '#1e40af' }
      case 'Preparando': return { bg: '#fef3c7', color: '#92400e' }
      case 'A caminho': return { bg: '#e0e7ff', color: '#3730a3' }
      case 'Entregue': return { bg: '#dcfce7', color: '#166534' }
      case 'Cancelado': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#f1f5f9', color: '#475569' }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmado': return '✅'
      case 'Preparando': return '👨‍🍳'
      case 'A caminho': return '🚚'
      case 'Entregue': return '📦'
      case 'Cancelado': return '❌'
      default: return '❓'
    }
  }

  return (
    <Layout>
      {/* Header Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.9rem',
              minWidth: '250px'
            }}
          />
          
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            <option value="todos">Todos os status</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Preparando">Preparando</option>
            <option value="A caminho">A caminho</option>
            <option value="Entregue">Entregue</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            📊 Relatório
          </button>
          <button style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            📤 Exportar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📦</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Total Hoje</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>234</p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Confirmados</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>45</p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚚</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Em Entrega</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#3730a3' }}>23</p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Entregues</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>189</p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💰</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Receita Hoje</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>R$ 8.9k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
            Lista de Pedidos ({filteredOrders.length})
          </h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          {filteredOrders.map((order) => {
            const statusStyle = getStatusColor(order.status)
            return (
              <div key={order.id} style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr',
                gap: '2rem',
                alignItems: 'start'
              }}>
                {/* Order Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
                      {order.id}
                    </h4>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color
                    }}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Cliente:</span> {order.customer}
                  </p>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Restaurante:</span> {order.restaurant}
                  </p>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Pagamento:</span> {order.paymentMethod}
                  </p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#10b981' }}>
                    {order.total}
                  </p>
                </div>

                {/* Order Details */}
                <div>
                  <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>
                    Itens do Pedido:
                  </h5>
                  <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1rem' }}>
                    {order.items.map((item, index) => (
                      <li key={index} style={{ fontSize: '0.9rem', color: '#374151', marginBottom: '0.25rem' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>📍 Endereço:</span> {order.address}
                  </p>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>🕐 Pedido:</span> {order.orderTime}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>🚚 Entrega prevista:</span> {order.deliveryTime}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    👁️ Ver Detalhes
                  </button>
                  
                  {order.status !== 'Entregue' && order.status !== 'Cancelado' && (
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      📍 Rastrear
                    </button>
                  )}
                  
                  {order.status === 'Confirmado' && (
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}