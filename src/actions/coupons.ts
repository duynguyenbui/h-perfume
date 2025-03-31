'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { Coupon } from '@/payload-types'
interface CouponResponse {
  success: boolean
  message: string
  data?: Coupon[] | any
}

export async function getValidCoupons({
  minimumPrice,
}: {
  minimumPrice: number
}): Promise<CouponResponse> {
  const { user } = await getServerSideUser()

  if (minimumPrice < 0) {
    console.warn('⚠️ Invalid minimum price:', minimumPrice)
    return { success: false, message: 'Minimum price must be greater than 0', data: [] }
  }

  const payload = await getPayloadClient()
  const currentDate = new Date().toISOString()

  console.log('Current Date:', currentDate)

  try {
    const { docs: coupons } = await payload.find({
      collection: 'coupons',
      where: {
        and: [
          { 'effectivePeriod.validFrom': { less_than_equal: currentDate } },
          { 'effectivePeriod.validTo': { greater_than_equal: currentDate } },
          { minimumPriceToUse: { less_than_equal: minimumPrice } },
          { quantity: { greater_than: 0 } },
        ],
      },
      pagination: false,
    })

    console.log('Fetched Coupons:', coupons.length)

    return { success: true, message: 'Get valid coupons successfully', data: coupons }
  } catch (error) {
    console.error('Error fetching valid coupons:', error)
    return { success: false, message: 'Failed to fetch valid coupons', data: [] }
  }
}

export async function collectCoupon(couponId: string): Promise<CouponResponse> {
  const { user } = await getServerSideUser()
  if (!user) {
    console.warn('Unauthorized access to collectCoupon')
    return { success: false, message: 'Unauthorized' }
  }

  try {
    const payload = await getPayloadClient()

    const coupon = await payload.findByID({
      collection: 'coupons',
      id: couponId,
    })

    if (!coupon) {
      console.warn('Coupon not found:', couponId)
      return { success: false, message: 'Coupon not found' }
    }

    const collectedUsers = coupon.collectedUsers || []
    if (collectedUsers.includes(user.id)) {
      console.warn(`⚠️User ${user.id} already collected coupon ${coupon.code}`)
      return { success: false, message: 'You have already collected this coupon' }
    }

    // Cập nhật coupon, thêm user vào danh sách collectedUsers
    await payload.update({
      collection: 'coupons',
      id: couponId,
      data: {
        collectedUsers: [...collectedUsers, user.id],
      },
    })

    console.log(`User ${user.id} collected coupon ${coupon.code}`)

    return { success: true, message: 'Coupon collected successfully' }
  } catch (error) {
    console.error('Error collecting coupon:', error)
    return { success: false, message: 'Failed to collect coupon' }
  }
}

export async function getAllCoupons(): Promise<CouponResponse> {
  const payload = await getPayloadClient()
  const currentDate = new Date()
  const expiredDate = new Date(currentDate)
  expiredDate.setDate(expiredDate.getDate() - 1) // Lùi lại 1 ngày
  const expiredISO = expiredDate.toISOString()
  const currentISO = currentDate.toISOString()

  console.log('Ngày hết hạn (trừ 1 ngày):', expiredISO)
  console.log('Ngày hiện tại:', currentISO)

  try {
    const { docs: coupons } = await payload.find({
      collection: 'coupons',
      where: {
        or: [
          { 'effectivePeriod.validTo': { less_than: expiredISO } }, // Hết hạn trước 1 ngày
          {
            and: [
              { 'effectivePeriod.validFrom': { less_than_equal: currentISO } },
              { 'effectivePeriod.validTo': { greater_than_equal: currentISO } },
              { quantity: { greater_than: 0 } },
            ],
          }, // Còn hiệu lực
        ],
      },
      pagination: false,
    })

    console.log('Tổng số mã giảm giá:', coupons.length)

    return {
      success: true,
      message: 'Lấy danh sách mã giảm giá thành công',
      data: coupons,
    }
  } catch (error) {
    console.error('Lỗi khi lấy mã giảm giá:', error)
    return { success: false, message: 'Không thể lấy danh sách mã giảm giá', data: [] }
  }
}

export async function redeemCoupon(couponId: string): Promise<CouponResponse> {
  try {
    const response = await fetch(`/api/coupons/redeem/${couponId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error('Error redeeming coupon:', error)
    return { success: false, message: 'Có lỗi xảy ra khi đổi mã' }
  }
}

export async function getCollectedCoupons({
  minimumPrice,
}: {
  minimumPrice: number
}): Promise<CouponResponse> {
  const { user } = await getServerSideUser()
  if (!user) {
    console.warn('Unauthorized access to getCollectedCoupons')
    return { success: false, message: 'Unauthorized', data: [] }
  }

  if (minimumPrice < 0) {
    console.warn('Invalid minimum price:', minimumPrice)
    return { success: false, message: 'Minimum price must be greater than 0', data: [] }
  }

  const payload = await getPayloadClient()
  const currentDate = new Date().toISOString()

  console.log('Current Date:', currentDate)
  console.log('User ID:', user.id)

  try {
    const { docs: coupons } = await payload.find({
      collection: 'coupons',
      where: {
        and: [
          { collectedUsers: { contains: user.id } }, // Chỉ lấy mã mà user đã thu thập
          { 'effectivePeriod.validFrom': { less_than_equal: currentDate } },
          { 'effectivePeriod.validTo': { greater_than_equal: currentDate } },
          { minimumPriceToUse: { less_than_equal: minimumPrice } },
          { quantity: { greater_than: 0 } },
        ],
      },
      pagination: false,
    })

    console.log('Fetched Collected Coupons:', coupons.length)

    return { success: true, message: 'Get collected coupons successfully', data: coupons }
  } catch (error) {
    console.error('Error fetching collected coupons:', error)
    return { success: false, message: 'Failed to fetch collected coupons', data: [] }
  }
}
