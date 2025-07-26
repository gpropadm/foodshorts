export default function Home() {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{
        color: '#10b981',
        fontSize: '3rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        🍕 FoodShorts Admin
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{
          color: '#059669',
          fontSize: '1.5rem',
          marginBottom: '1rem'
        }}>
          ✅ FUNCIONANDO NA VERCEL!
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#eff6ff',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{color: '#1e40af', margin: '0 0 0.5rem 0'}}>Usuários</h3>
            <p style={{fontSize: '2rem', fontWeight: 'bold', margin: 0}}>1,247</p>
          </div>
          
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{color: '#15803d', margin: '0 0 0.5rem 0'}}>Lojistas</h3>
            <p style={{fontSize: '2rem', fontWeight: 'bold', margin: 0}}>89</p>
          </div>
          
          <div style={{
            backgroundColor: '#fff7ed',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{color: '#ea580c', margin: '0 0 0.5rem 0'}}>Pedidos</h3>
            <p style={{fontSize: '2rem', fontWeight: 'bold', margin: 0}}>3,456</p>
          </div>
          
          <div style={{
            backgroundColor: '#faf5ff',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{color: '#9333ea', margin: '0 0 0.5rem 0'}}>Receita</h3>
            <p style={{fontSize: '2rem', fontWeight: 'bold', margin: 0}}>R$ 45.6k</p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '2px solid #10b981',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{color: '#047857', margin: '0 0 1rem 0'}}>
            🎉 Deploy Realizado com Sucesso!
          </h2>
          <p style={{color: '#065f46', margin: 0, fontSize: '1.1rem'}}>
            FoodShorts Admin Panel está funcionando perfeitamente na Vercel!
          </p>
        </div>
      </div>
    </div>
  )
}