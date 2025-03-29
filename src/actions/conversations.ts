'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'

export const getConversation = async (conversationId: string) => {
  const client = await getPayloadClient()
  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) {
    return { success: false, message: 'Unauthorized', data: undefined }
  }

  const conversation = await client.findByID({
    collection: 'conversations',
    id: conversationId,
    depth: 1,
  })

  if (!conversation) {
    return { success: false, message: 'Conversation not found', data: undefined }
  }

  const { participants } = conversation

  const isParticipant = (participants as any[]).some(
    (participant: any) => participant.id === currentUser.id,
  )

  if (!isParticipant && !currentUser.roles.includes('admin')) {
    return {
      success: false,
      message: 'You are not a participant of this conversation',
      data: undefined,
    }
  }

  return { success: true, message: 'Get conversation successfully', data: conversation }
}
