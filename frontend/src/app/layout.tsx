import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/widgets/header/ui/header'
import { Footer } from '@/widgets/footer/ui/footer'

const inter = Inter({ subsets: ['cyrillic', 'latin'] })

export const metadata: Metadata = {
  title: 'Vendory - Современный маркетплейс',
  description: 'Покупайте и продавайте товары по выгодным ценам. Тысячи товаров от проверенных продавцов.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
