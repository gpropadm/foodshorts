import { useState } from 'react'
import Layout from '../components/Layout'

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')

  const users = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', status: 'Ativo', orders: 23, total: 'R$ 567,80', created: '15/01/2024' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 88888-8888', status: 'Ativo', orders: 45, total: 'R$ 1.234,50', created: '20/01/2024' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', phone: '(11) 77777-7777', status: 'Inativo', orders: 12, total: 'R$ 245,90', created: '10/01/2024' },
    { id: 4, name: 'Ana Lima', email: 'ana@email.com', phone: '(11) 66666-6666', status: 'Ativo', orders: 67, total: 'R$ 2.890,30', created: '05/01/2024' },
    { id: 5, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 55555-5555', status: 'Bloqueado', orders: 8, total: 'R$ 156,70', created: '22/01/2024' },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'todos' || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return { bg: '#dcfce7', color: '#166534' }
      case 'Inativo': return { bg: '#f1f5f9', color: '#475569' }
      case 'Bloqueado': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#f1f5f9', color: '#475569' }
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
            placeholder="Buscar usuários..."
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
            <option value="Inativo">Inativo</option>
            <option value="Bloqueado">Bloqueado</option>
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
          + Novo Usuário
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
            <span style={{ fontSize: '1.5rem' }}>👥</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Total de Usuários</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>1,247</p>
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
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Usuários Ativos</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>1,089</p>
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
            <span style={{ fontSize: '1.5rem' }}>🚫</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Usuários Bloqueados</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>23</p>
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
            <span style={{ fontSize: '1.5rem' }}>📈</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Novos Hoje</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
            Lista de Usuários ({filteredUsers.length})
          </h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Nome</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Telefone</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Pedidos</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Total Gasto</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const statusStyle = getStatusColor(user.status)
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}>
                          👤
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '500', color: '#0f172a' }}>{user.name}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#0f172a' }}>{user.email}</td>
                    <td style={{ padding: '1rem', color: '#0f172a' }}>{user.phone}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{user.orders}</td>
                    <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '600' }}>{user.total}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{
                          padding: '0.5rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}>
                          👁️ Ver
                        </button>
                        <button style={{
                          padding: '0.5rem',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}>
                          ✏️ Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}