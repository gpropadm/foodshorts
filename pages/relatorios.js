import { useState } from 'react'
import Layout from '../components/Layout'

export default function Relatorios() {
  const [selectedReport, setSelectedReport] = useState('vendas')

  const reportTypes = [
    { key: 'vendas', label: 'Relatório de Vendas', icon: '📊' },
    { key: 'usuarios', label: 'Relatório de Usuários', icon: '👥' },
    { key: 'lojistas', label: 'Relatório de Lojistas', icon: '🏪' },
    { key: 'entregas', label: 'Relatório de Entregas', icon: '🚚' },
    { key: 'financeiro', label: 'Relatório Financeiro', icon: '💰' }
  ]

  const salesData = [
    { period: 'Janeiro 2024', orders: 1234, revenue: 'R$ 45.678,90', growth: '+12%' },
    { period: 'Dezembro 2023', orders: 1098, revenue: 'R$ 40.567,80', growth: '+8%' },
    { period: 'Novembro 2023', orders: 1156, revenue: 'R$ 42.890,50', growth: '+15%' },
    { period: 'Outubro 2023', orders: 987, revenue: 'R$ 36.445,20', growth: '+5%' }
  ]

  const topRestaurants = [
    { name: 'Pizza Express', orders: 456, revenue: 'R$ 18.234,50', rating: 4.8 },
    { name: 'Burger King', orders: 389, revenue: 'R$ 15.678,90', rating: 4.5 },
    { name: 'Sushi Bar', orders: 234, revenue: 'R$ 12.890,30', rating: 4.9 },
    { name: 'Taco Bell', orders: 198, revenue: 'R$ 8.567,40', rating: 4.2 }
  ]

  const deliveryStats = [
    { metric: 'Tempo médio de entrega', value: '28 min', trend: '-2 min' },
    { metric: 'Taxa de sucesso', value: '94.5%', trend: '+1.2%' },
    { metric: 'Avaliação média', value: '4.6/5', trend: '+0.1' },
    { metric: 'Entregas no prazo', value: '89.3%', trend: '+3.1%' }
  ]

  return (
    <Layout>
      {/* Report Type Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {reportTypes.map((report) => (
            <button
              key={report.key}
              onClick={() => setSelectedReport(report.key)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: selectedReport === report.key ? '#10b981' : 'white',
                color: selectedReport === report.key ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{report.icon}</span>
              {report.label}
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
            📅 Período
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

      {/* Quick Stats */}
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
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Vendas do Mês</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            R$ 234.5k
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#10b981' }}>
            +22% vs mês anterior
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
            <span style={{ fontSize: '1.5rem' }}>📦</span>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Pedidos do Mês</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
            6,234
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#10b981' }}>
            +18% vs mês anterior
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
            <span style={{ fontSize: '1.5rem' }}>👥</span>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Novos Usuários</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
            234
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#10b981' }}>
            +12% vs mês anterior
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
            <span style={{ fontSize: '1.5rem' }}>⭐</span>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Satisfação</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            4.6/5
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#10b981' }}>
            +0.2 vs mês anterior
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Sales History */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
              📈 Histórico de Vendas
            </h3>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Período</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Pedidos</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Receita</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Crescimento</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((data, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{data.period}</td>
                    <td style={{ padding: '1rem', color: '#0f172a' }}>{data.orders}</td>
                    <td style={{ padding: '1rem', color: '#10b981', fontWeight: '600' }}>{data.revenue}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: '#dcfce7',
                        color: '#166534'
                      }}>
                        {data.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Restaurants */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
              🏆 Top Restaurantes
            </h3>
          </div>
          
          <div>
            {topRestaurants.map((restaurant, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                borderBottom: index < topRestaurants.length - 1 ? '1px solid #e2e8f0' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
                    #{index + 1} {restaurant.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>⭐</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{restaurant.rating}</span>
                  </div>
                </div>
                
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#64748b' }}>
                  {restaurant.orders} pedidos
                </p>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#10b981' }}>
                  {restaurant.revenue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Performance */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
            🚚 Performance de Entregas
          </h3>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          padding: '1.5rem'
        }}>
          {deliveryStats.map((stat, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#64748b' }}>
                {stat.metric}
              </h4>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>
                {stat.value}
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981' }}>
                {stat.trend} vs mês anterior
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}