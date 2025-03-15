'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'

export async function getShippingFeeByMinimumPrice({ minimumPrice }: { minimumPrice: number }) {
  const { user } = await getServerSideUser()

  if (!user) {
    return { success: false, message: 'Unauthorized', data: undefined }
  }

  const payload = await getPayloadClient()

  const { docs: shippingFees, totalDocs } = await payload.find({
    collection: 'shippingFees',
    where: {
      and: [
        {
          minPrice: {
            less_than_equal: minimumPrice,
          },
        },
        {
          maxPrice: {
            greater_than_equal: minimumPrice,
          },
        },
      ],
    },
    depth: 0,
    pagination: false,
  })

  const result = totalDocs > 0 ? shippingFees[0] : null

  return { success: true, message: 'Get shipping fee successfully', data: result }
}
