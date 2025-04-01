'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { PayloadCheckoutValidator, TPayloadCheckoutValidator } from '@/validations'
import { LineItem, OrderToCreate } from '@/types'
import { Fragrance } from '@/payload-types'

export async function createOrder(orderToCreate: TPayloadCheckoutValidator) {
  const { user } = await getServerSideUser()

  if (!user) {
    console.warn('Unauthorized access to createOrder')
    return { success: false, message: 'Bạn cần đăng nhập để tạo đơn hàng', data: undefined }
  }

  const payload = await getPayloadClient()

  const { success } = PayloadCheckoutValidator.safeParse(orderToCreate)
  if (!success) {
    console.warn('Invalid order data:', orderToCreate)
    return { success: false, message: 'Đơn hàng không hợp lệ', data: undefined }
  }

  const { lineItems, shippingAddressId, shippingFeeId, paymentMethod, couponId } = orderToCreate

  try {
    const shippingAddress = await payload.findByID({
      collection: 'shippingAddresses',
      id: shippingAddressId,
      depth: 0,
    })
    if (!shippingAddress) {
      console.warn('Shipping address not found:', shippingAddressId)
      return { success: false, message: 'Địa chỉ giao hàng không tồn tại', data: undefined }
    }

    const shippingFee = await payload.findByID({
      collection: 'shippingFees',
      id: shippingFeeId,
      depth: 0,
    })
    if (!shippingFee || typeof shippingFee.fee !== 'number') {
      console.warn('Invalid shipping fee:', shippingFeeId)
      return {
        success: false,
        message: 'Phí vận chuyển không tồn tại hoặc không hợp lệ',
        data: undefined,
      }
    }

    const { docs: shippingStatus } = await payload.find({
      collection: 'shippingStatuses',
      where: {
        name: { equals: 'Pending' },
      },
      limit: 1,
      depth: 0,
      pagination: false,
    })
    if (!shippingStatus || shippingStatus.length === 0) {
      console.warn('Shipping status "Pending" not found')
      return {
        success: false,
        message: `Trạng thái giao hàng 'Pending' không tồn tại`,
        data: undefined,
      }
    }

    const { docs: paymentStatus } = await payload.find({
      collection: 'paymentStatuses',
      where: {
        name: { equals: 'Pending' },
      },
      limit: 1,
      depth: 0,
      pagination: false,
    })
    if (!paymentStatus || paymentStatus.length === 0) {
      console.warn('Payment status "Pending" not found')
      return {
        success: false,
        message: `Trạng thái thanh toán 'Pending' không tồn tại`,
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
        console.warn('Fragrance not found:', lineItem.id)
        return {
          success: false,
          message: `Sản phẩm ${lineItem.id} không tồn tại`,
          data: undefined,
        }
      }

      if (fragrance.quantity < lineItem.quantity) {
        console.warn('Insufficient stock for fragrance:', fragrance.name)
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
          parent: { equals: fragrance.id },
        },
        sort: '-createdAt',
        depth: 0,
      })
      if (!versionOfFragrance || versionOfFragrance.length === 0) {
        console.warn('No version found for fragrance:', fragrance.name)
        return {
          success: false,
          message: `Không tìm thấy phiên bản cho sản phẩm ${fragrance.name}`,
          data: undefined,
        }
      }

      lineItemsToBeCreated.push({
        fragrance: fragrance.id,
        versionOfFragrance: versionOfFragrance[0].id,
        quantity: lineItem.quantity,
        discount: fragrance.discount || 0,
        price: fragrance.price,
      })
    }

    const totalPrice = lineItemsToBeCreated.reduce(
      (acc, curr) =>
        acc + curr.price * curr.quantity - (curr.discount * curr.quantity * curr.price) / 100,
      0,
    )
    let finalPrice = totalPrice + shippingFee.fee

    let coupon = null
    if (couponId) {
      coupon = await payload.findByID({
        collection: 'coupons',
        id: couponId,
        depth: 0,
      })
      if (!coupon) {
        console.warn('Coupon not found:', couponId)
        return { success: false, message: 'Mã giảm giá không tồn tại', data: undefined }
      }

      // Kiểm tra xem người dùng đã thu thập mã giảm giá này chưa
      const collectedUsers = coupon.collectedUsers || []
      if (!collectedUsers.includes(user.id)) {
        console.warn(`User ${user.id} has not collected coupon ${coupon.code}`)
        return { success: false, message: 'Bạn chưa thu thập mã giảm giá này', data: undefined }
      }

      // Kiểm tra xem người dùng đã sử dụng mã giảm giá này chưa
      const usedUsers = coupon.currentUse || []
      if (usedUsers.includes(user.id)) {
        console.warn(`User ${user.id} has already used coupon ${coupon.code}`)
        return { success: false, message: 'Bạn đã sử dụng mã giảm giá này rồi', data: undefined }
      }

      // Kiểm tra thời gian hiệu lực của mã giảm giá
      const currentDate = new Date()
      if (
        currentDate < new Date(coupon.effectivePeriod.validFrom) ||
        currentDate > new Date(coupon.effectivePeriod.validTo)
      ) {
        console.warn(`Coupon ${coupon.code} is not valid at this time`)
        return { success: false, message: 'Mã giảm giá đã hết hạn', data: undefined }
      }

      // Kiểm tra số lượng mã giảm giá còn lại
      if (coupon.quantity <= 0) {
        console.warn(`Coupon ${coupon.code} is out of stock`)
        return { success: false, message: 'Mã giảm giá đã hết', data: undefined }
      }

      // Kiểm tra giá trị đơn hàng tối thiểu
      if (totalPrice < coupon.minimumPriceToUse) {
        console.warn(
          `Order total ${totalPrice} is less than minimum price ${coupon.minimumPriceToUse} for coupon ${coupon.code}`,
        )
        return {
          success: false,
          message: `Đơn hàng tối thiểu ${coupon.minimumPriceToUse.toLocaleString('vi-VN')}₫ để sử dụng mã này`,
          data: undefined,
        }
      }

      // Tính toán giảm giá
      if (coupon.discountType === 'percentage') {
        finalPrice -= (totalPrice * coupon.discountAmount) / 100
      } else if (coupon.discountType === 'fixed') {
        finalPrice -= coupon.discountAmount
      }
      finalPrice = Math.max(finalPrice, 0)
    }

    const orderToBeCreated: OrderToCreate = {
      orderer: user.id,
      lineItems: lineItemsToBeCreated,
      totalPrice,
      finalPrice,
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

    // Cập nhật số lượng tồn kho
    await Promise.all(
      lineItemsToBeCreated.map(async (lineItem) => {
        const fragrance = await payload.findByID({
          collection: 'fragrances',
          id: lineItem.fragrance as string,
          depth: 0,
        })
        if (fragrance) {
          await payload.update({
            collection: 'fragrances',
            id: lineItem.fragrance as string,
            data: {
              quantity: fragrance.quantity - lineItem.quantity,
            },
          })
        }
      }),
    )

    // Nếu có coupon, cập nhật trường currentUse
    if (coupon) {
      const usedUsers = coupon.currentUse || []
      await payload.update({
        collection: 'coupons',
        id: coupon.id,
        data: {
          currentUse: [...usedUsers, user.id],
        },
      })
      console.log(`User ${user.id} has been added to currentUse for coupon ${coupon.code}`)
    }

    console.log(`Order created successfully: ${order.id}`)
    return { success: true, message: 'Tạo đơn hàng thành công', data: order }
  } catch (error) {
    console.error('Error in createOrder:', error)
    return {
      success: false,
      message:
        'Có lỗi xảy ra khi tạo đơn hàng: ' +
        (error instanceof Error ? error.message : String(error)),
      data: undefined,
    }
  }
}

export async function getUserOrders() {
  const { user } = await getServerSideUser()
  if (!user) {
    return { success: false, message: 'Bạn cần đăng nhập để xem đơn hàng', orders: [] }
  }

  const payload = await getPayloadClient()

  try {
    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: {
        orderer: { equals: user.id },
      },
      depth: 1,
    })

    return { success: true, message: 'Lấy danh sách đơn hàng thành công', orders }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return {
      success: false,
      message:
        'Có lỗi xảy ra khi lấy danh sách đơn hàng: ' +
        (error instanceof Error ? error.message : String(error)),
      orders: [],
    }
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatusId: string) {
  const payload = await getPayloadClient()

  try {
    const updatedOrder = await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        paymentStatus: paymentStatusId,
      },
    })

    console.log(`Payment status updated to ${paymentStatusId} for order: ${orderId}`)
    return {
      success: true,
      message: 'Cập nhật trạng thái thanh toán thành công',
      order: updatedOrder,
    }
  } catch (error) {
    console.error('Error updating payment status:', error)
    return {
      success: false,
      message:
        'Có lỗi xảy ra khi cập nhật trạng thái thanh toán: ' +
        (error instanceof Error ? error.message : String(error)),
    }
  }
}
