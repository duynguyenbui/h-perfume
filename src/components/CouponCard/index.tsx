'use client'

import { Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCouponStore, Coupon } from '@/stores/CouponStore'
import { useAuth } from '@/providers/AuthProvider'

interface CouponCardProps {
  coupon: Coupon
  isExpired?: boolean
  isCollected?: boolean
}

export default function CouponCard({
  coupon,
  isExpired = false,
  isCollected = false,
}: CouponCardProps) {
  const { collectCouponAction } = useCouponStore()
  const { user } = useAuth()

  if (!coupon) {
    console.error('Invalid coupon:', coupon)
    return <div className="text-red-500 p-4">Không có mã giảm giá</div>
  }

  const handleCollect = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thu thập mã!')
      return
    }

    if (isCollected) {
      alert('Bạn đã thu thập mã giảm giá này rồi!')
      return
    }

    if (coupon.quantity <= 0) {
      alert('Mã giảm giá này đã hết!')
      return
    }

    try {
      await collectCouponAction(coupon.id, user.id)
      alert(`Bạn đã thu thập mã: ${coupon.code}`)
    } catch (error) {
      alert('Có lỗi xảy ra khi thu thập mã: ' + ((error as Error).message || 'Unknown error'))
    }
  }

  return (
    <div
      className={`relative border rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
        isExpired
          ? 'bg-gray-100 text-gray-500'
          : 'bg-white hover:bg-gradient-to-br from-indigo-50 to-purple-50'
      }`}
    >
      {/* Ribbon effect */}
      {!isExpired && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Active
        </div>
      )}

      <Ticket
        className={`w-14 h-14 mx-auto mb-4 ${isExpired ? 'text-gray-400' : 'text-indigo-600'}`}
      />
      <h2 className="text-xl font-bold text-center mb-2 tracking-wide">
        {coupon.code || 'Mã không hợp lệ'}
      </h2>
      <p className="text-sm text-center text-gray-600 italic mb-3">
        {coupon.description || 'Không có mô tả'}
      </p>
      <div className="space-y-2 text-center">
        <p className="text-base font-semibold text-green-600">
          Giảm:{' '}
          {coupon.discountType === 'percentage'
            ? `${coupon.discountAmount}%`
            : `${coupon.discountAmount.toLocaleString()}₫`}
        </p>
        <p className="text-sm text-gray-600">
          Tối thiểu: {coupon.minimumPriceToUse.toLocaleString()}₫
        </p>
        <p className="text-xs text-gray-500">Còn lại: {coupon.quantity}</p>
      </div>

      <div className="mt-4">
        {!isExpired && !isCollected && coupon.quantity > 0 && (
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            onClick={handleCollect}
          >
            📥 Thu Thập Ngay
          </Button>
        )}
        {!isExpired && !isCollected && coupon.quantity <= 0 && (
          <Button className="w-full bg-gray-300 text-gray-600 cursor-not-allowed" disabled>
            Hết Mã
          </Button>
        )}
        {!isExpired && isCollected && (
          <Button className="w-full bg-gray-300 text-gray-600 cursor-not-allowed" disabled>
            Đã Thu Thập
          </Button>
        )}
      </div>
    </div>
  )
}
