'use server'

import { getPayloadClient } from '@/get-payload'

export const getValidCollections = async () => {
  const payload = await getPayloadClient()

  const today = new Date()

  const { docs: collections, totalDocs } = await payload.find({
    collection: 'collections',
    where: {
      'period.from': {
        less_than_equal: today,
      },
      'period.to': {
        greater_than_equal: today,
      },
    },
    pagination: false,
    depth: 1,
  })

  const results = totalDocs > 0 ? collections : []

  return results
}
