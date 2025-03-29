'use server'

import { getPayloadClient } from '@/get-payload'

export const getMessagesByConversationId = async (conversationId: string) => {
  const payloadClient = await getPayloadClient()

  const { docs: messages } = await payloadClient.find({
    collection: 'messages',
    pagination: false,
    depth: 2,
    where: {
      'conversation.id': {
        equals: conversationId,
      },
    },
    sort: 'createdAt',
  })

  if (!messages) {
    return { success: false, message: 'No messages found', data: undefined }
  }

  return { success: true, message: 'Get messages successfully', data: messages }
}
