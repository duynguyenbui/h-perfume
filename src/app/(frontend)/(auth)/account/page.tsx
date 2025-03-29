import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getServerSideUser } from '@/get-serverside-user'
import { redirect } from 'next/navigation'
import { AccountForm } from '@/components/Forms/Account'
import { AddressList } from '@/components/AddressList'

export default async function Page() {
  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) {
    redirect('/login')
  }

  if (currentUser.roles.includes('admin')) {
    redirect('/admin')
  }

  return (
    <div className="mx-auto container max-w-4xl px-4 py-8 flex justify-center items-center">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
          <TabsTrigger value="address">Địa chỉ</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountForm user={currentUser} />
        </TabsContent>
        <TabsContent value="address">
          <AddressList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
