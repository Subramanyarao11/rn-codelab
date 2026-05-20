import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { DesktopGate } from '@/components/layout/DesktopGate'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'RN Debug Labs',
  description: 'Fix broken React Native code. Pass the tests. Learn by debugging.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DesktopGate>{children}</DesktopGate>
      </body>
    </html>
  )
}
