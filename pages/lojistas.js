import { useState } from 'react'
import Layout from '../components/Layout'

export default function Lojistas() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')

  const stores = [
    { 
      id: 1, 
      name: 'Pizza Express', 
      owner: 'João Pizzaiolo', 
      category: 'Pizzaria', 
      phone: '(11) 99999-1111', 
      status: 'Ativo', 
      rating: 4.8,
      orders: 156, 
      revenue: 'R$ 12.450,00',
      address: 'Rua das Pizzas, 123',
      created: '10/01/2024'
    },
    { 
      id: 2, 
      name: 'Burger King', 
      owner: 'Maria Hambúrguer', 
      category: 'Hamburgueria', 
      phone: '(11) 88888-2222', 
      status: 'Ativo', 
      rating: 4.5,
      orders: 89, 
      revenue: 'R$ 8.920,00',
      address: 'Av. dos Burgers, 456',
      created: '15/01/2024'
    },
    { 
      id: 3, 
      name: 'Sushi Bar', 
      owner: 'Takeshi Sushi', 
      category: 'Japonesa', 
      phone: '(11) 77777-3333', 
      status: 'Pendente', 
      rating: 4.9,
      orders: 23, 
      revenue: 'R$ 3.450,00',
      address: 'Rua do Sushi, 789',
      created: '20/01/2024'
    },
    { 
      id: 4, 
      name: 'Taco Bell', 
      owner: 'Carlos Mexicano', 
      category: 'Mexicana', 
      phone: '(11) 66666-4444', 
      status: 'Inativo', 
      rating: 4.2,
      orders: 45, 
      revenue: 'R$ 2.890,00',
      address: 'Rua dos Tacos, 321',
      created: '05/01/2024'
    },
  ]

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'todos' || store.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return { bg: '#dcfce7', color: '#166534' }
      case 'Pendente': return { bg: '#fef3c7', color: '#92400e' }
      case 'Inativo': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#f1f5f9', color: '#475569' }
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Pizzaria': '🍕',
      'Hamburgueria': '🍔',
      'Japonesa': '🍣',
      'Mexicana': '🌮',
      'Italiana': '🍝',
      'Brasileira': '🍖'
    }
    return icons[category] || '🍽️'
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
            placeholder="Buscar lojistas..."
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
            <option value="Ativo">Ativo</option>
            <option value="Pendente">Pendente</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          + Novo Lojista
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            <span style={{ fontSize: '1.5rem' }}>🏪</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Total de Lojistas</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>89</p>
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
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Lojistas Ativos</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>67</p>
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
            <span style={{ fontSize: '1.5rem' }}>⏳</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Aguardando Aprovação</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>12</p>
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
            <span style={{ fontSize: '1.5rem' }}>⭐</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Avaliação Média</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>4.6</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredStores.map((store) => {
          const statusStyle = getStatusColor(store.status)
          return (
            <div key={store.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {getCategoryIcon(store.category)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
                      {store.name}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
                      {store.category}
                    </p>
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color
                }}>
                  {store.status}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Proprietário:</span> {store.owner}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Telefone:</span> {store.phone}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Endereço:</span> {store.address}
                  </p>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>
                      {store.rating}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>⭐ Avaliação</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>
                      {store.orders}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>📦 Pedidos</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                      {store.revenue}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>💰 Receita</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                  <button style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    👁️ Ver Detalhes
                  </button>
                  <button style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    ✏️ Editar
                  </button>
                  {store.status === 'Pendente' && (
                    <button style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      ✅ Aprovar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}