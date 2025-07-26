import { Users, Store, ShoppingBag, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🍕 FoodShorts Admin - Vercel Deploy Success!
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Lojistas Online</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pedidos Hoje</p>
                <p className="text-2xl font-bold">3,456</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Receita</p>
                <p className="text-2xl font-bold">R$ 45,678</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-green-600">✅ FoodShorts Admin Funcionando na Vercel!</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">📱 Mobile Demo Features:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Feed de vídeos estilo TikTok</li>
                <li>• Sistema de Foodcoins</li>
                <li>• Stories de lojistas online/offline</li>
                <li>• Fontes customizadas (Everett, Aeonik)</li>
                <li>• Interface mobile responsiva</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">🚀 Admin Panel Features:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Dashboard com métricas em tempo real</li>
                <li>• Gestão de pedidos e lojistas</li>
                <li>• Sistema de reviews e ranking</li>
                <li>• Compliance LGPD</li>
                <li>• Deploy na Vercel funcionando!</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-semibold text-center">
              🎉 Parabéns! FoodShorts está rodando na Vercel com sucesso!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}