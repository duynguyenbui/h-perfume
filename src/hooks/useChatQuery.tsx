'use client'

import useSWR from 'swr'
import { getMessagesByConversationId } from '@/actions/messages'
import { useSocket } from '@/providers/SocketProvider'
import { useParams } from 'next/navigation'
import { CHAT_KEY } from '@/constants'

export const useChatQuery = () => {
  const { isConnected } = useSocket()
  const params = useParams<{ conversationId: string }>()

  const getMessages = async () => {
    return params?.conversationId
      ? ((await getMessagesByConversationId(params.conversationId))?.data ?? [])
      : []
  }

  const cacheKey = params?.conversationId ? `${CHAT_KEY}:${params.conversationId}` : null

  const {
    data: messages,
    error,
    isLoading,
  } = useSWR(cacheKey, getMessages, {
    refreshInterval: isConnected ? undefined : 1000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    keepPreviousData: true,
  })

  return { messages, error, isLoading }
}
