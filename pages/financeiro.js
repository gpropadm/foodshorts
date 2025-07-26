import { useState } from 'react'
import Layout from '../components/Layout'

export default function Financeiro() {
  const [selectedPeriod, setSelectedPeriod] = useState('hoje')

  const financialData = {
    hoje: {
      revenue: 'R$ 8.945,67',
      orders: 234,
      averageTicket: 'R$ 38,23',
      commission: 'R$ 1.341,85',
      withdrawals: 'R$ 2.450,00',
      balance: 'R$ 6.495,67'
    },
    semana: {
      revenue: 'R$ 56.743,21',
      orders: 1567,
      averageTicket: 'R$ 36,20',
      commission: 'R$ 8.511,48',
      withdrawals: 'R$ 15.200,00',
      balance: 'R$ 41.543,21'
    },
    mes: {
      revenue: 'R$ 234.567,89',
      orders: 6234,
      averageTicket: 'R$ 37,65',
      commission: 'R$ 35.185,18',
      withdrawals: 'R$ 67.800,00',
      balance: 'R$ 166.767,89'
    }
  }

  const transactions = [
    {
      id: 'T001',
      type: 'Receita',
      description: 'Comissão - Pizza Express',
      amount: 'R$ 156,78',
      date: '26/01/2024',
      time: '16:45',
      status: 'Concluído'
    },
    {
      id: 'T002',
      type: 'Saque',
      description: 'Saque - João Pizzaiolo',
      amount: 'R$ 850,00',
      date: '26/01/2024',
      time: '14:30',
      status: 'Processando'
    },
    {
      id: 'T003',
      type: 'Receita',
      description: 'Comissão - Burger King',
      amount: 'R$ 89,45',
      date: '26/01/2024',
      time: '13:22',
      status: 'Concluído'
    },
    {
      id: 'T004',
      type: 'Receita',
      description: 'Comissão - Sushi Bar',
      amount: 'R$ 234,67',
      date: '26/01/2024',
      time: '12:15',
      status: 'Concluído'
    },
    {
      id: 'T005',
      type: 'Estorno',
      description: 'Estorno - Pedido #12349',
      amount: 'R$ 67,80',
      date: '26/01/2024',
      time: '11:00',
      status: 'Concluído'
    }
  ]

  const withdrawalRequests = [
    {
      id: 'S001',
      restaurant: 'Pizza Express',
      owner: 'João Pizzaiolo',
      amount: 'R$ 1.245,67',
      requestDate: '26/01/2024',
      status: 'Pendente'
    },
    {
      id: 'S002',
      restaurant: 'Taco Bell',
      owner: 'Carlos Mexicano',
      amount: 'R$ 567,89',
      requestDate: '25/01/2024',
      status: 'Aprovado'
    },
    {
      id: 'S003',
      restaurant: 'Sushi Bar',
      owner: 'Takeshi Sushi',
      amount: 'R$ 890,45',
      requestDate: '25/01/2024',
      status: 'Processando'
    }
  ]

  const currentData = financialData[selectedPeriod]

  const getTransactionColor = (type) => {
    switch (type) {
      case 'Receita': return { bg: '#dcfce7', color: '#166534' }
      case 'Saque': return { bg: '#fef3c7', color: '#92400e' }
      case 'Estorno': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#f1f5f9', color: '#475569' }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído': return { bg: '#dcfce7', color: '#166534' }
      case 'Processando': return { bg: '#fef3c7', color: '#92400e' }
      case 'Pendente': return { bg: '#dbeafe', color: '#1e40af' }
      case 'Aprovado': return { bg: '#dcfce7', color: '#166534' }
      default: return { bg: '#f1f5f9', color: '#475569' }
    }
  }

  return (
    <Layout>
      {/* Period Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { key: 'hoje', label: 'Hoje' },
            { key: 'semana', label: 'Esta Semana' },
            { key: 'mes', label: 'Este Mês' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: selectedPeriod === period.key ? '#10b981' : 'white',
                color: selectedPeriod === period.key ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {period.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#3b82f6',
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

      {/* Financial Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💰</span>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Receita Total</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {currentData.revenue}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            {currentData.orders} pedidos
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏪</span>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Comissão</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {currentData.commission}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            15% do total
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💳</span>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Ticket Médio</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>
            {currentData.averageTicket}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Por pedido
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📤</span>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Saques</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {currentData.withdrawals}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Total sacado
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💼</span>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Saldo</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
            {currentData.balance}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Disponível
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Transactions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
              💸 Transações Recentes
            </h3>
          </div>
          
          <div>
            {transactions.map((transaction) => {
              const typeStyle = getTransactionColor(transaction.type)
              const statusStyle = getStatusColor(transaction.status)
              
              return (
                <div key={transaction.id} style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        backgroundColor: typeStyle.bg,
                        color: typeStyle.color
                      }}>
                        {transaction.type}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color
                      }}>
                        {transaction.status}
                      </span>
                    </div>
                    
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: '500', color: '#0f172a' }}>
                      {transaction.description}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                      {transaction.date} às {transaction.time}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: transaction.type === 'Receita' ? '#10b981' : 
                            transaction.type === 'Saque' ? '#f59e0b' : '#dc2626'
                    }}>
                      {transaction.type === 'Receita' ? '+' : '-'}{transaction.amount}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Withdrawal Requests */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
              📤 Solicitações de Saque
            </h3>
          </div>
          
          <div>
            {withdrawalRequests.map((request) => {
              const statusStyle = getStatusColor(request.status)
              
              return (
                <div key={request.id} style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>
                      {request.restaurant}
                    </h4>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color
                    }}>
                      {request.status}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                    {request.owner}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
                    {request.amount}
                  </p>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Solicitado em {request.requestDate}
                  </p>
                  
                  {request.status === 'Pendente' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                        ✅ Aprovar
                      </button>
                      <button style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                        ❌ Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}