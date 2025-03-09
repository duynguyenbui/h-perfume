import React from 'react'
import './globals.css'
import { Providers } from '@/providers'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  description: 'H-Perfume Shop',
  title: 'H-Perfume Shop',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Toaster position="top-left" />
        </Providers>
      </body>
    </html>
  )
}
