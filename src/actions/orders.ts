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

  const { success } = PayloadCheckoutValidator.safeParse(orderToCreate)

  if (!success) {
    return { success: false, message: 'Đơn hàng không hợp lệ', data: undefined }
  }

  const { lineItems, shippingAddressId, shippingFeeId, paymentMethod } = orderToCreate

  const shippingAddress = await payload.findByID({
    collection: 'shippingAddresses',
    id: shippingAddressId,
    depth: 0,
  })

  if (!shippingAddress) {
    return { success: false, message: 'Địa chỉ giao hàng không tồn tại', data: undefined }
  }

  const shippingFee = await payload.findByID({
    collection: 'shippingFees',
    id: shippingFeeId,
    depth: 0,
  })

  if (!shippingFee || typeof shippingFee.fee !== 'number') {
    return {
      success: false,
      message: 'Phí vận chuyển không tồn tại hoặc không hợp lệ',
      data: undefined,
    }
  }

  const { docs: shippingStatus } = await payload.find({
    collection: 'shippingStatuses',
    where: {
      value: { equals: 'pending' }, // Sử dụng `value` thay vì `name` để khớp với schema
    },
    limit: 1,
    depth: 0,
    pagination: false,
  })

  if (!shippingStatus || shippingStatus.length === 0) {
    return {
      success: false,
      message: `Trạng thái giao hàng 'pending' không tồn tại`,
      data: undefined,
    }
  }

  const { docs: paymentStatus } = await payload.find({
    collection: 'paymentStatuses',
    where: {
      value: { equals: 'pending' },
    },
    limit: 1,
    depth: 0,
    pagination: false,
  })

  if (!paymentStatus || paymentStatus.length === 0) {
    return {
      success: false,
      message: `Trạng thái thanh toán 'pending' không tồn tại`,
      data: undefined,
    }
  }

  const lineItemsToBeCreated: LineItem[] = []

  for (const lineItem of lineItems) {
    const fragrance = await payload.findByID({
      collection: 'fragrances',
      id: lineItem.id,
      depth: 0,
    })

    if (!fragrance) {
      return {
        success: false,
        message: `Sản phẩm ${lineItem.id} không tồn tại`,
        data: undefined,
      }
    }

    // Kiểm tra số lượng tồn kho
    if (fragrance.quantity < lineItem.quantity) {
      return {
        success: false,
        message: `Sản phẩm ${fragrance.name} không đủ số lượng (còn lại: ${fragrance.quantity})`,
        data: undefined,
      }
    }

    const { docs: versionOfFragrance } = await payload.findVersions({
      collection: 'fragrances',
      limit: 1,
      where: {
        parent: {
          equals: fragrance.id,
        },
      },
      sort: '-createdAt',
      depth: 0,
    })

    if (!versionOfFragrance || versionOfFragrance.length === 0) {
      return {
        success: false,
        message: `Không tìm thấy phiên bản cho sản phẩm ${fragrance.name}`,
        data: undefined,
      }
    }

    const lineItemToBeCreated: LineItem = {
      fragrance: fragrance.id, // Gán ID thay vì toàn bộ đối tượng
      versionOfFragrance: versionOfFragrance[0].id,
      quantity: lineItem.quantity,
      discount: fragrance.discount || 0,
      price: fragrance.price,
    }

    lineItemsToBeCreated.push(lineItemToBeCreated)
  }

  const totalPrice = lineItemsToBeCreated.reduce(
    (acc, curr) =>
      acc + curr.price * curr.quantity - (curr.discount * curr.quantity * curr.price) / 100,
    0,
  )

  const finalPrice = totalPrice + shippingFee.fee

  let coupon = null

  if (orderToCreate.couponId) {
    coupon = await payload.findByID({
      collection: 'coupons',
      id: orderToCreate.couponId,
      depth: 0,
    })

    if (!coupon) {
      return {
        success: false,
        message: `Mã giảm giá không tồn tại`,
        data: undefined,
      }
    }
  }

  const orderToBeCreated: OrderToCreate = {
    orderer: user.id,
    lineItems: lineItemsToBeCreated,
    totalPrice: totalPrice,
    finalPrice: finalPrice,
    shippingFee: shippingFee.fee,
    shippingStatus: shippingStatus[0].id,
    finalAddress: shippingAddress.id,
    paymentStatus: paymentStatus[0].id,
    paymentMethod: paymentMethod as 'momo' | 'cod',
    coupon: coupon ? coupon.id : null,
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
        id: lineItem.fragrance as string,
        data: {
          quantity:
            (
              await payload.findByID({
                collection: 'fragrances',
                id: lineItem.fragrance as string,
              })
            ).quantity - lineItem.quantity,
        },
      })
    }),
  )

  return { success: true, message: 'Tạo đơn hàng thành công', data: order }
}
