'use client'

import { useEffect } from 'react'
import { useCouponStore } from '@/stores/CouponStore'
import CouponCard from '@/components/CouponCard'
import { Loader2 } from 'lucide-react'

import { useAuth } from '@/providers/AuthProvider'

export default function CouponsPage() {
  const { validCoupons, expiredCoupons, loading, fetchCoupons, setUser } = useCouponStore()
  const { user } = useAuth()

  useEffect(() => {
    setUser(user ?? null)
  }, [user, setUser])

  useEffect(() => {
    console.log('🔄 Fetching Coupons...')
    fetchCoupons(user?.id).then(() => {
      console.log('✅ Coupons Fetched:', { validCoupons, expiredCoupons })
    })
  }, [fetchCoupons, user?.id])

  const classifyCoupons = (coupons: any[]) => {
    const freeCoupons = coupons.filter((coupon) => coupon.minimumPriceToUse === 0)
    const paidCoupons = coupons.filter((coupon) => coupon.minimumPriceToUse > 0)
    return { freeCoupons, paidCoupons }
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        🎟️ Kho Mã Giảm Giá
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
        </div>
      ) : (
        <div className="space-y-12">
          {/* Mã giảm giá hợp lệ */}
          <section className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center justify-center">
              ✅ Mã Đang Hoạt Động
            </h2>

            {/* Mã miễn phí */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                🎉 Mã Miễn Phí
              </h3>
              {classifyCoupons(validCoupons).freeCoupons.length === 0 ? (
                <p className="text-center text-gray-600 bg-white py-4 rounded-lg shadow">
                  Hiện tại chưa có mã miễn phí nào.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classifyCoupons(validCoupons).freeCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={{ ...coupon, isCollected: coupon.isCollected }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mã theo giá */}
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                💸 Mã Theo Giá
              </h3>
              {classifyCoupons(validCoupons).paidCoupons.length === 0 ? (
                <p className="text-center text-gray-600 bg-white py-4 rounded-lg shadow">
                  Hiện tại chưa có mã theo giá nào.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classifyCoupons(validCoupons).paidCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={{ ...coupon, isCollected: coupon.isCollected }}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
