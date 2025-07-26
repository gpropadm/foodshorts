import { useState } from 'react'
import Layout from '../components/Layout'

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('geral')

  const tabs = [
    { key: 'geral', label: 'Geral', icon: '⚙️' },
    { key: 'usuarios', label: 'Usuários', icon: '👥' },
    { key: 'pagamentos', label: 'Pagamentos', icon: '💳' },
    { key: 'entregas', label: 'Entregas', icon: '🚚' },
    { key: 'notificacoes', label: 'Notificações', icon: '🔔' }
  ]

  const [settings, setSettings] = useState({
    appName: 'FoodShorts',
    supportEmail: 'suporte@foodshorts.com',
    supportPhone: '(11) 99999-9999',
    minOrderValue: '15.00',
    deliveryFee: '4.99',
    commissionRate: '15',
    maxDeliveryDistance: '10',
    estimatedDeliveryTime: '30',
    allowUserRegistration: true,
    requireEmailVerification: true,
    allowGuestOrders: false,
    enablePushNotifications: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const renderGeneralTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
          Informações da Plataforma
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
              Nome da Aplicação
            </label>
            <input
              type="text"
              value={settings.appName}
              onChange={(e) => handleSettingChange('appName', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
              Email de Suporte
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
          Configurações de Pedidos
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
              Valor Mínimo do Pedido (R$)
            </label>
            <input
              type="number"
              value={settings.minOrderValue}
              onChange={(e) => handleSettingChange('minOrderValue', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
              Taxa de Entrega (R$)
            </label>
            <input
              type="number"
              value={settings.deliveryFee}
              onChange={(e) => handleSettingChange('deliveryFee', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderPaymentsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
          Configurações Financeiras
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
              Taxa de Comissão (%)
            </label>
            <input
              type="number"
              value={settings.commissionRate}
              onChange={(e) => handleSettingChange('commissionRate', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
          💳 Métodos de Pagamento Aceitos
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { key: 'pix', label: 'PIX', enabled: true },
            { key: 'card', label: 'Cartão de Crédito/Débito', enabled: true },
            { key: 'cash', label: 'Dinheiro na Entrega', enabled: true },
            { key: 'voucher', label: 'Vale Refeição', enabled: false }
          ].map((method) => (
            <label key={method.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                defaultChecked={method.enabled}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#374151' }}>{method.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDeliveryTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
          Configurações de Entrega
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
              Distância Máxima (km)
            </label>
            <input
              type="number"
              value={settings.maxDeliveryDistance}
              onChange={(e) => handleSettingChange('maxDeliveryDistance', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
              Tempo Estimado (min)
            </label>
            <input
              type="number"
              value={settings.estimatedDeliveryTime}
              onChange={(e) => handleSettingChange('estimatedDeliveryTime', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
          🚚 Zonas de Entrega Ativas
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            'Centro - Taxa: R$ 2,99',
            'Zona Norte - Taxa: R$ 4,99',
            'Zona Sul - Taxa: R$ 5,99',
            'Zona Leste - Taxa: R$ 4,99',
            'Zona Oeste - Taxa: R$ 6,99'
          ].map((zone, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ fontSize: '0.9rem', color: '#374151' }}>{zone}</span>
              <button style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}>
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderUsersTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
          Configurações de Usuários
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'allowUserRegistration', label: 'Permitir registro de novos usuários', description: 'Usuários podem se cadastrar na plataforma' },
            { key: 'requireEmailVerification', label: 'Exigir verificação de email', description: 'Usuários devem verificar o email para ativar a conta' },
            { key: 'allowGuestOrders', label: 'Permitir pedidos como convidado', description: 'Usuários podem fazer pedidos sem se cadastrar' }
          ].map((setting) => (
            <div key={setting.key} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>
                  {setting.label}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  {setting.description}
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings[setting.key]}
                  onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                  style={{ transform: 'scale(1.3)' }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
          Configurações de Notificações
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'enablePushNotifications', label: 'Notificações Push', description: 'Enviar notificações push para o aplicativo móvel' },
            { key: 'enableEmailNotifications', label: 'Notificações por Email', description: 'Enviar notificações importantes por email' },
            { key: 'enableSMSNotifications', label: 'Notificações por SMS', description: 'Enviar notificações críticas por SMS' }
          ].map((setting) => (
            <div key={setting.key} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>
                  {setting.label}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  {setting.description}
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings[setting.key]}
                  onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                  style={{ transform: 'scale(1.3)' }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'geral': return renderGeneralTab()
      case 'usuarios': return renderUsersTab()
      case 'pagamentos': return renderPaymentsTab()
      case 'entregas': return renderDeliveryTab()
      case 'notificacoes': return renderNotificationsTab()
      default: return renderGeneralTab()
    }
  }

  return (
    <Layout>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#0f172a' }}>
          ⚙️ Configurações do Sistema
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            🔄 Restaurar Padrões
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
            💾 Salvar Alterações
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: activeTab === tab.key ? '#10b981' : 'white',
              color: activeTab === tab.key ? 'white' : '#374151',
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
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        padding: '2rem'
      }}>
        {renderTabContent()}
      </div>
    </Layout>
  )
}