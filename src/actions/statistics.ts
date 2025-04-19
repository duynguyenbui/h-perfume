'use server'

import { getPayloadClient } from '@/get-payload'
import { Fragrance } from '@/payload-types'

export const getBestSellingProducts = async () => {
  const currentDate = new Date()
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const payload = await getPayloadClient()

  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      and: [
        {
          createdAt: {
            greater_than_equal: startDate,
          },
        },
        {
          createdAt: {
            less_than_equal: endDate,
          },
        },
      ],
    },
    depth: 2,
  })

  const productSalesMap = new Map()

  orders.forEach((order) => {
    if (order.lineItems && Array.isArray(order.lineItems)) {
      order.lineItems.forEach((item) => {
        if (item.fragrance) {
          const fragrance = item.fragrance as Fragrance

          const productId = fragrance.id
          const productName = fragrance.name
          const quantity = item.quantity || 1

          if (productSalesMap.has(productId)) {
            const currentProduct = productSalesMap.get(productId)
            productSalesMap.set(productId, {
              product: currentProduct.product,
              sales: currentProduct.sales + quantity,
            })
          } else {
            productSalesMap.set(productId, {
              product: productName,
              sales: quantity,
            })
          }
        }
      })
    }
  })

  const productSales = Array.from(productSalesMap.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  return productSales
}

export const getRevenueInMonth = async () => {
  const daysInMonth = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31,
  ]

  const currentDate = new Date()
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const payload = await getPayloadClient()

  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      and: [
        {
          createdAt: {
            greater_than_equal: startDate,
          },
        },
        {
          createdAt: {
            less_than_equal: endDate,
          },
        },
      ],
    },
  })

  let revenueByDay = daysInMonth.map((day) => ({
    day: day.toString(),
    revenue: 0,
  }))

  orders.forEach((order) => {
    const finalPrice = order.finalPrice || 0

    const orderDate = new Date(order.createdAt)
    const dayOfMonth = orderDate.getDate()

    if (dayOfMonth >= 1 && dayOfMonth <= 31) {
      revenueByDay[dayOfMonth - 1].revenue += finalPrice
    }
  })

  const totalRevenue = revenueByDay.reduce((sum, day) => sum + day.revenue, 0)

  revenueByDay = revenueByDay.filter((data) => {
    return data.revenue > 0
  })

  return {
    dailyRevenue: revenueByDay,
    totalRevenue,
  }
}
