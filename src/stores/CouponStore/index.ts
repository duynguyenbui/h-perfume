import { create } from 'zustand'
import { getAllCoupons, collectCoupon } from '@/actions/coupons'
import { User } from '@/payload-types'

export interface Coupon {
  id: string
  code: string
  description?: string | null
  discountType: 'percentage' | 'fixed'
  discountAmount: number
  minimumPriceToUse: number
  quantity: number
  collectedUsers?: (string | User)[] | null
  effectivePeriod: {
    validFrom: string
    validTo: string
  }
  isCollected?: boolean
}

interface CouponState {
  validCoupons: Coupon[]
  expiredCoupons: Coupon[]
  loading: boolean
  user: User | null
  fetchCoupons: (userId?: string) => Promise<void>
  collectCouponAction: (couponId: string, userId: string) => Promise<void>
  setUser: (user: User | null) => void
}

export const useCouponStore = create<CouponState>((set, get) => ({
  validCoupons: [],
  expiredCoupons: [],
  loading: false,
  user: null,

  fetchCoupons: async (userId?: string) => {
    set({ loading: true })
    const response = await getAllCoupons()

    if (response.success) {
      const validCoupons = response.data.filter(
        (coupon: Coupon) =>
          coupon.effectivePeriod?.validTo && new Date(coupon.effectivePeriod.validTo) >= new Date(),
      )

      const expiredCoupons = response.data.filter(
        (coupon: Coupon) =>
          coupon.effectivePeriod?.validTo && new Date(coupon.effectivePeriod.validTo) < new Date(),
      )

      const updatedValidCoupons = validCoupons.map((coupon) => {
        const collectedUsers =
          coupon.collectedUsers?.map((u) => (typeof u === 'string' ? u : u.id)) || []
        const isCollected = userId ? collectedUsers.includes(userId) : false
        return {
          ...coupon,
          isCollected,
        }
      })

      set({ validCoupons: updatedValidCoupons, expiredCoupons, loading: false })
    } else {
      console.error('API Error:', response.message)
      set({ loading: false })
    }
  },

  collectCouponAction: async (couponId, userId) => {
    const response = await collectCoupon(couponId)

    if (response.success) {
      set((state) => {
        const coupon = state.validCoupons.find((coupon) => coupon.id === couponId)
        const collectedUsers =
          coupon?.collectedUsers?.map((u) => (typeof u === 'string' ? u : u.id)) || []
        const isCollected = collectedUsers.includes(userId)

        if (!isCollected && coupon) {
          return {
            validCoupons: state.validCoupons.map((coupon) =>
              coupon.id === couponId
                ? {
                    ...coupon,
                    collectedUsers: [...(coupon.collectedUsers ?? []), userId],
                    isCollected: true,
                  }
                : coupon,
            ),
          }
        }

        return {
          validCoupons: [...state.validCoupons],
        }
      })
    } else {
      console.error(response.message)
    }
  },

  setUser: (user: User | null) => {
    set({ user })
  },
}))
