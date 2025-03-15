'use server'

import { getPayloadClient } from '@/get-payload'

export const getFragrances = async ({
  page = 1,
  limit = 10,
  collection = '',
}: {
  page?: number
  limit?: number
  collection?: string
}) => {
  const payload = await getPayloadClient()

  let whereClause: any = {
    and: [
      {
        isActive: {
          equals: true,
        },
      },
    ],
  }

  if (collection) {
    whereClause.and.push({
      collections: {
        equals: collection,
      },
    })
  }

  const { docs: fragrances, totalDocs } = await payload.find({
    collection: 'fragrances',
    limit,
    page,
    depth: 1,
    where: whereClause,
  })

  if (totalDocs === 0) {
    return { success: false, message: 'Không tìm thấy nước hoa', data: [] }
  }

  return { success: true, message: 'Lấy danh sách nước hoa thành công', data: fragrances }
}

export const getFragranceById = async ({ fragranceId }: { fragranceId: string }) => {
  const payload = await getPayloadClient()

  const fragrance = await payload.findByID({
    collection: 'fragrances',
    id: fragranceId,
    depth: 1,
  })

  if (!fragrance) {
    return { success: false, message: 'Không tìm thấy nước hoa', data: null }
  }

  return { success: true, message: 'Lấy nước hoa thành công', data: fragrance }
}
