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
// action user lay coupons
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
  const { user } = await getServerSideUser() // Lấy thông tin người dùng
  const payload = await getPayloadClient()
  const currentDate = new Date()
  const currentISO = currentDate.toISOString()

  console.log('getAllCoupons - Current Date:', currentISO)
  console.log('getAllCoupons - User ID:', user?.id || 'No user logged in')

  try {
    const { docs: coupons } = await payload.find({
      collection: 'coupons',
      where: {
        or: [
          { 'effectivePeriod.validTo': { less_than: currentISO } }, // Hết hạn trước ngày hiện tại
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

    // Thêm thuộc tính isCollected và isUsed cho từng coupon
    const couponsWithStatus = coupons.map((coupon) => {
      // Chuyển đổi collectedUsers và currentUse thành mảng các string (ID)
      const collectedUsers = (coupon.collectedUsers || []).map((u: string | { id: string }) =>
        typeof u === 'string' ? u : u.id,
      )
      const usedUsers = (coupon.currentUse || []).map((u: string | { id: string }) =>
        typeof u === 'string' ? u : u.id,
      )

      const isCollected = user ? collectedUsers.includes(user.id) : false
      const isUsed = user ? usedUsers.includes(user.id) : false

      // Log chi tiết để kiểm tra
      console.log('getAllCoupons - Coupon Status:', {
        couponId: coupon.id,
        code: coupon.code,
        collectedUsers,
        usedUsers,
        userId: user?.id || 'No user',
        isCollected,
        isUsed,
      })

      return {
        ...coupon,
        isCollected, // Trạng thái "đã thu thập"
        isUsed, // Trạng thái "đã sử dụng"
      }
    })

    console.log('getAllCoupons - Total Coupons:', coupons.length)

    return {
      success: true,
      message: 'Lấy danh sách mã giảm giá thành công',
      data: couponsWithStatus,
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
          { collectedUsers: { contains: user.id } },
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
