'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'

export async function getValidCoupons({ minimumPrice }: { minimumPrice: number }) {
  const { user } = await getServerSideUser()
  console.log(minimumPrice) //lấy giá trị minimumPrice ok
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  if (minimumPrice < 0) {
    return { success: false, message: 'Minimum price must be greater than 0', data: [] }
  }

  const currentDate = new Date()

  const payload = await getPayloadClient()
  console.log('Payload instance:', payload) // Kiểm tra giá trị payload
  const { docs: coupons, totalDocs } = await payload.find({
    collection: 'coupons',
    where: {
      and: [
        {
          'effectivePeriod.validFrom': {
            less_than_equal: currentDate,
          },
        },
        {
          'effectivePeriod.validTo': {
            greater_than_equal: currentDate,
          },
        },
        {
          minimumPriceToUse: { less_than_equal: minimumPrice },
        },

        {
          quantity: {
            greater_than: 0,
          },
        },
      ],
    },

    depth: 2,
    pagination: false,
  })

  const results = totalDocs > 0 ? coupons : []

  return { success: true, message: 'Get valid coupons successfully', data: results }
}
