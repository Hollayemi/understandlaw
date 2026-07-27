"use client"
import React from 'react'
import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { store } from './store'
import SessionSync from '@/app/components/providers/SessionSync'

const ProviderWrapper = ({
  children,
  session,
}: {
  children: React.ReactNode
  session?: Session | null
}) => {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <SessionSync />
        {children}
      </Provider>
    </SessionProvider>
  )
}

export default ProviderWrapper