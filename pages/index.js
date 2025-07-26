import Layout from '../components/Layout'

export default function Dashboard() {
  const stats = [
    { name: 'Usuários Ativos', value: '1,247', change: '+12%', icon: '👥', color: '#3b82f6' },
    { name: 'Lojistas', value: '89', change: '+5%', icon: '🏪', color: '#10b981' },
    { name: 'Pedidos Hoje', value: '234', change: '+18%', icon: '📦', color: '#f59e0b' },
    { name: 'Receita Mensal', value: 'R$ 45.6k', change: '+22%', icon: '💰', color: '#8b5cf6' },
  ]

  const recentOrders = [
    { id: '#1234', customer: 'João Silva', restaurant: 'Pizza Express', value: 'R$ 45,90', status: 'Entregue' },
    { id: '#1235', customer: 'Maria Santos', restaurant: 'Burger King', value: 'R$ 32,50', status: 'A caminho' },
    { id: '#1236', customer: 'Pedro Costa', restaurant: 'Sushi Bar', value: 'R$ 89,90', status: 'Preparando' },
    { id: '#1237', customer: 'Ana Lima', restaurant: 'Taco Bell', value: 'R$ 28,90', status: 'Confirmado' },
  ]

  return (
    <Layout>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>{stat.name}</p>
                <p style={{ margin: '0.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>
                  {stat.value}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981' }}>{stat.change} vs mês anterior</p>
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: stat.color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
            📦 Pedidos Recentes
          </h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Cliente</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Restaurante</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Valor</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{order.id}</td>
                  <td style={{ padding: '1rem', color: '#0f172a' }}>{order.customer}</td>
                  <td style={{ padding: '1rem', color: '#0f172a' }}>{order.restaurant}</td>
                  <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '600' }}>{order.value}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: order.status === 'Entregue' ? '#dcfce7' : 
                                    order.status === 'A caminho' ? '#fef3c7' :
                                    order.status === 'Preparando' ? '#dbeafe' : '#f1f5f9',
                      color: order.status === 'Entregue' ? '#166534' : 
                            order.status === 'A caminho' ? '#92400e' :
                            order.status === 'Preparando' ? '#1e40af' : '#475569'
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}