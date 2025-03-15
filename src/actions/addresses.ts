'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'

export async function getShippingAddresses() {
  const { user } = await getServerSideUser()

  if (!user) {
    return { success: false, message: 'Unauthorized', data: undefined }
  }

  const payload = await getPayloadClient()

  const { docs: addresses, totalDocs } = await payload.find({
    collection: 'shippingAddresses',
    where: {
      'user.id': {
        equals: user.id,
      },
    },
    depth: 0,
    pagination: false,
  })

  const results = totalDocs > 0 ? addresses : []

  return { success: true, message: 'Get addresses successfully', data: results }
}
