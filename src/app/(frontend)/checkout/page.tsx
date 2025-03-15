import CheckoutDetail from '@/components/CheckoutDetail'
import { getServerSideUser } from '@/get-serverside-user'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const { user } = await getServerSideUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutDetail />
    </div>
  )
}
