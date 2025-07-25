import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Dashboard } from '@/components/Dashboard'

export default function Home() {
  return (
    <main>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                FoodShorts Admin
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Faça login para acessar o painel administrativo
              </p>
            </div>
            <SignIn routing="hash" />
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold text-gray-900">
                    FoodShorts Admin
                  </h1>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Dashboard />
          </main>
        </div>
      </SignedIn>
    </main>
  )
}