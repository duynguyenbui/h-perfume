import { create } from 'zustand'

interface Coupon {
  code: string
  discountAmount: number
}

interface CouponState {
  selectedCoupon: Coupon | null
  selectCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
}

export const useCouponStore = create<CouponState>((set) => ({
  selectedCoupon: null,

  selectCoupon: (coupon) => set({ selectedCoupon: coupon }),

  removeCoupon: () => set({ selectedCoupon: null }),
}))
