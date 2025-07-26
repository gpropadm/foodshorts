import { useState } from 'react'
import Layout from '../components/Layout'

export default function Entregas() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')

  const deliveries = [
    {
      id: '#E-001',
      orderId: '#12346',
      customer: 'Maria Santos',
      restaurant: 'Burger King',
      deliveryMan: 'Carlos Entregador',
      deliveryManPhone: '(11) 99999-0001',
      status: 'A caminho',
      startTime: '15:45',
      estimatedTime: '16:30',
      actualTime: '-',
      distance: '2.5 km',
      address: 'Av. B, 456 - Jardins',
      total: 'R$ 32,50',
      deliveryFee: 'R$ 4,90'
    },
    {
      id: '#E-002',
      orderId: '#12347',
      customer: 'Pedro Costa',
      restaurant: 'Sushi Bar',
      deliveryMan: 'João Motoboy',
      deliveryManPhone: '(11) 99999-0002',
      status: 'Aguardando',
      startTime: '-',
      estimatedTime: '17:00',
      actualTime: '-',
      distance: '1.8 km',
      address: 'Rua C, 789 - Vila Nova',
      total: 'R$ 89,90',
      deliveryFee: 'R$ 3,50'
    },
    {
      id: '#E-003',
      orderId: '#12345',
      customer: 'João Silva',
      restaurant: 'Pizza Express',
      deliveryMan: 'Ana Delivery',
      deliveryManPhone: '(11) 99999-0003',
      status: 'Entregue',
      startTime: '14:45',
      estimatedTime: '15:30',
      actualTime: '15:15',
      distance: '3.2 km',
      address: 'Rua A, 123 - Centro',
      total: 'R$ 45,90',
      deliveryFee: 'R$ 5,50'
    },
    {
      id: '#E-004',
      orderId: '#12348',
      customer: 'Ana Lima',
      restaurant: 'Taco Bell',
      deliveryMan: 'Marcos Bike',
      deliveryManPhone: '(11) 99999-0004',
      status: 'Coletando',
      startTime: '16:15',
      estimatedTime: '17:15',
      actualTime: '-',
      distance: '1.2 km',
      address: 'Rua D, 321 - Centro',
      total: 'R$ 28,90',
      deliveryFee: 'R$ 2,90'
    }
  ]

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.deliveryMan.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'todos' || delivery.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aguardando': return { bg: '#fef3c7', color: '#92400e' }
      case 'Coletando': return { bg: '#dbeafe', color: '#1e40af' }
      case 'A caminho': return { bg: '#e0e7ff', color: '#3730a3' }
      case 'Entregue': return { bg: '#dcfce7', color: '#166534' }
      case 'Problema': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#f1f5f9', color: '#475569' }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aguardando': return '⏳'
      case 'Coletando': return '📦'
      case 'A caminho': return '🚚'
      case 'Entregue': return '✅'
      case 'Problema': return '⚠️'
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
          <input
            type="text"
            placeholder="Buscar entregas..."
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
            <option value="Aguardando">Aguardando</option>
            <option value="Coletando">Coletando</option>
            <option value="A caminho">A caminho</option>
            <option value="Entregue">Entregue</option>
            <option value="Problema">Problema</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
          🗺️ Mapa
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
            + Entregador
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
            <span style={{ fontSize: '1.5rem' }}>🚚</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Em Andamento</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>23</p>
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
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Entregues Hoje</p>
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
            <span style={{ fontSize: '1.5rem' }}>🏍️</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Entregadores Ativos</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#3730a3' }}>34</p>
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
            <span style={{ fontSize: '1.5rem' }}>⏱️</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Tempo Médio</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>28min</p>
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
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Problemas</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
            Entregas em Tempo Real ({filteredDeliveries.length})
          </h3>
        </div>
        
        <div>
          {filteredDeliveries.map((delivery) => {
            const statusStyle = getStatusColor(delivery.status)
            return (
              <div key={delivery.id} style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 200px',
                gap: '2rem',
                alignItems: 'start'
              }}>
                {/* Delivery Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
                      {delivery.id}
                    </h4>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color
                    }}>
                      {getStatusIcon(delivery.status)} {delivery.status}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Pedido:</span> {delivery.orderId}
                  </p>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Cliente:</span> {delivery.customer}
                  </p>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Restaurante:</span> {delivery.restaurant}
                  </p>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#10b981' }}>
                    {delivery.total} + {delivery.deliveryFee}
                  </p>
                </div>

                {/* Delivery Man */}
                <div>
                  <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>
                    🏍️ Entregador:
                  </h5>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#0f172a', fontWeight: '500' }}>
                    {delivery.deliveryMan}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    📞 {delivery.deliveryManPhone}
                  </p>
                  
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>📍 Distância:</span> {delivery.distance}
                  </p>
                </div>

                {/* Timeline */}
                <div>
                  <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>
                    ⏰ Horários:
                  </h5>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Saída:</span> {delivery.startTime || 'Aguardando'}
                  </p>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Previsto:</span> {delivery.estimatedTime}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Entregue:</span> {delivery.actualTime || 'Pendente'}
                  </p>
                  
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    📍 {delivery.address}
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
                    🗺️ Rastrear
                  </button>
                  
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
                    📞 Contatar
                  </button>
                  
                  {delivery.status !== 'Entregue' && (
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      ⚠️ Problema
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