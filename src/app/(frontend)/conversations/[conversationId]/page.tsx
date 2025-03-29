import { getServerSideUser } from '@/get-serverside-user'
import { getConversation } from '@/actions/conversations'
import { redirect } from 'next/navigation'
import React from 'react'
import { Chat } from '@/components/Chat'
import { getPayloadClient } from '@/get-payload'
interface PageProps {
  params: Promise<{
    conversationId: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { conversationId } = await params
  const { user } = await getServerSideUser()
  const client = await getPayloadClient()

  if (!user || !conversationId) {
    redirect('/login')
  }

  const { data: conversation } = await getConversation(conversationId)

  if (!conversation) {
    redirect('/')
  }

  if (
    !(conversation.participants as any[]).some((participant) => participant.id === user.id) &&
    user.roles.includes('admin')
  ) {
    await client.update({
      collection: 'conversations',
      id: conversationId,
      data: {
        participants: [...conversation.participants, user],
      },
    })
  }

  return <Chat conversation={conversation} />
}
