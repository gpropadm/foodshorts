import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Usuários', href: '/usuarios', icon: '👥' },
    { name: 'Lojistas', href: '/lojistas', icon: '🏪' },
    { name: 'Pedidos', href: '/pedidos', icon: '📦' },
    { name: 'Entregas', href: '/entregas', icon: '🚚' },
    { name: 'Financeiro', href: '/financeiro', icon: '💰' },
    { name: 'Relatórios', href: '/relatorios', icon: '📈' },
    { name: 'Configurações', href: '/configuracoes', icon: '⚙️' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '70px',
        backgroundColor: '#1e293b',
        transition: 'width 0.3s ease',
        position: 'relative'
      }}>
        {/* Logo */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🍕</span>
          {sidebarOpen && (
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
              FoodShorts Admin
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1rem 0' }}>
          {navigation.map((item) => {
            const isActive = router.pathname === item.href
            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  margin: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  color: isActive ? '#10b981' : '#cbd5e1',
                  backgroundColor: isActive ? '#0f172a' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <span style={{ fontSize: '1.2rem', minWidth: '20px' }}>{item.icon}</span>
                  {sidebarOpen && (
                    <span style={{ fontSize: '0.9rem', fontWeight: isActive ? '600' : '400' }}>
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '80px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid #334155',
            backgroundColor: '#1e293b',
            color: '#cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}
        >
          {sidebarOpen ? '←' : '→'}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#0f172a'
          }}>
            {navigation.find(item => item.href === router.pathname)?.name || 'Dashboard'}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}>
              ✅ Online
            </span>
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
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '2rem',
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}