'use server'

import { getPayloadClient } from '@/get-payload'

export const getMedia = async (id: string) => {
  const payload = await getPayloadClient()

  const media = await payload.findByID({
    collection: 'media',
    id,
  })

  return media ?? null
}
