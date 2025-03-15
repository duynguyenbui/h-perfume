'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { PayloadCheckoutValidator, TPayloadCheckoutValidator } from '@/validations'
import { LineItem, OrderToCreate } from '@/types'
import { Fragrance } from '@/payload-types'

export async function createOrder(orderToCreate: TPayloadCheckoutValidator) {
  const { user } = await getServerSideUser()

  if (!user) {
    return { success: false, message: 'Bạn cần đăng nhập để tạo đơn hàng', data: undefined }
  }

  const payload = await getPayloadClient()
  const transactionID = await payload.db.beginTransaction()

  try {
    // Handle the order creation logic here
    const { success } = PayloadCheckoutValidator.safeParse(orderToCreate)

    if (!success) {
      return { success: false, message: 'Đơn hàng không hợp lệ', data: undefined }
    }

    const { lineItems, shippingAddressId, shippingFeeId, paymentMethod } = orderToCreate

    const shippingAddress = await payload.findByID({
      collection: 'shippingAddresses',
      id: shippingAddressId,
    })

    if (!shippingAddress) {
      return { success: false, message: 'Địa chỉ giao hàng không tồn tại', data: undefined }
    }

    const shippingFee = await payload.findByID({
      collection: 'shippingFees',
      id: shippingFeeId,
    })

    if (!shippingFee) {
      return { success: false, message: 'Phí vận chuyển không tồn tại', data: undefined }
    }

    const { docs: shippingStatus } = await payload.find({
      collection: 'shippingStatuses',
      where: {
        name: {
          like: 'Pending',
        },
      },
      limit: 1,
      depth: 0,
      pagination: false,
    })

    if (!shippingStatus) {
      return {
        success: false,
        message: `Trạng thái giao hàng ${`Pending`} không tồn tại`,
        data: undefined,
      }
    }

    const { docs: paymentStatus, totalDocs: totalPaymentStatus } = await payload.find({
      collection: 'paymentStatuses',
      where: {
        name: {
          like: 'Pending',
        },
      },
      limit: 1,
      depth: 0,
      pagination: false,
    })

    if (!paymentStatus) {
      return {
        success: false,
        message: `Trạng thái thanh toán ${`Pending`} không tồn tại`,
        data: undefined,
      }
    }

    let lineItemsToBeCreated: LineItem[] = []

    for (const lineItem of lineItems) {
      const fragrance = await payload.findByID({
        collection: 'fragrances',
        id: lineItem.id,
      })

      if (!fragrance) {
        return {
          success: false,
          message: `Sản phẩm ${lineItem.id} không tồn tại`,
          data: undefined,
        }
      }

      const { docs: versionOfFragrance } = await payload.findVersions({
        collection: 'fragrances', // required
        limit: 1,
        where: {
          parent: {
            equals: fragrance.id,
          },
        },
        sort: '-createdAt',
        depth: 0,
      })

      const lineItemToBeCreated: LineItem = {
        fragrance: fragrance,
        versionOfFragrance: versionOfFragrance[0].id,
        quantity: lineItem.quantity,
        discount: fragrance.discount,
        price: fragrance.price,
      }

      lineItemsToBeCreated.push(lineItemToBeCreated)
    }

    const totalPrice = lineItemsToBeCreated.reduce(
      (acc, curr) =>
        acc + curr.price * curr.quantity - (curr.discount * curr.quantity * curr.price) / 100,
      0,
    )

    let finalPrice = totalPrice + (shippingFee.fee || 0)

    let coupon = null

    if (orderToCreate.couponId) {
      coupon = await payload.findByID({
        collection: 'coupons',
        id: orderToCreate.couponId,
      })
    }

    const orderToBeCreated: OrderToCreate = {
      orderer: user,
      lineItems: lineItemsToBeCreated,
      totalPrice: totalPrice,
      finalPrice: finalPrice,
      shippingFee: shippingFee.fee,
      shippingStatus: shippingStatus[0],
      finalAddress: shippingAddress,
      paymentStatus: paymentStatus[0],
      paymentMethod: paymentMethod as 'stripe' | 'cod',
    }

    const order = await payload.create({
      collection: 'orders',
      data: orderToBeCreated,
    })

    if (!order) {
      return { success: false, message: 'Lỗi khi tạo đơn hàng', data: undefined }
    }

    await Promise.all(
      lineItemsToBeCreated.map(async (lineItem) => {
        await payload.update({
          collection: 'fragrances',
          id: (lineItem.fragrance as Fragrance).id,
          data: {
            quantity: (lineItem.fragrance as Fragrance).quantity - lineItem.quantity,
          },
        })
      }),
    )

    // Commit the transaction
    transactionID && (await payload.db.commitTransaction(transactionID))

    return { success: true, message: 'Tạo đơn hàng thành công', data: order }
  } catch (error) {
    // Rollback the transaction
    transactionID && (await payload.db.rollbackTransaction(transactionID))
    return { success: false, message: 'Lỗi khi tạo đơn hàng', data: undefined }
  }
}
