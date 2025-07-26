export const metadata = {
  title: 'FoodShorts Admin',
  description: 'Admin panel funcionando na Vercel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{margin: 0, backgroundColor: '#f9fafb'}}>{children}</body>
    </html>
  )
}