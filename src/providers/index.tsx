'use client'

import React, { useEffect, useState } from 'react'

import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from './ThemeProvider'
import ModalsProvider from './ModalsProvider'
import { CrispChat } from './CrispProvider'
import { SocketProvider } from './SocketProvider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ModalsProvider />
          <CrispChat />
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  )
}
