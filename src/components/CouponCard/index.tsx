'use client'

import { Ticket, Check, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCouponStore, type Coupon } from '@/stores/CouponStore'
import { useAuth } from '@/providers/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface CouponCardProps {
  coupon: Coupon & { isCollected?: boolean; isUsed?: boolean }
  isExpired?: boolean
}

export default function CouponCard({ coupon, isExpired = false }: CouponCardProps) {
  const { collectCouponAction } = useCouponStore()
  const { user } = useAuth()

  if (!coupon) {
    return (
      <div className="text-red-500 p-4 text-center rounded-lg border border-red-200 bg-red-50">
        Không có mã giảm giá
      </div>
    )
  }

  const isCollected = coupon.isCollected || false
  const isUsed = coupon.isUsed || false

  const handleCollect = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thu thập mã!')
      return
    }

    if (isUsed) {
      toast.error('Mã giảm giá này đã được sử dụng!')
      return
    }

    if (isCollected) {
      toast.error('Bạn đã thu thập mã giảm giá này rồi!')
      return
    }

    if (coupon.quantity <= 0) {
      toast.error('Mã giảm giá này đã hết!')
      return
    }

    try {
      await collectCouponAction(coupon.id, user.id)
      toast.success(`Bạn đã thu thập mã: ${coupon.code}`)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thu thập mã: ' + ((error as Error).message || 'Unknown error'))
    }
  }

  // Determine card status and styling
  const getCardStatus = () => {
    if (isExpired)
      return {
        icon: <Clock className="w-4 h-4" />,
        text: 'Hết Hạn',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
      }
    if (isUsed)
      return {
        icon: <Check className="w-4 h-4" />,
        text: 'Đã Sử Dụng',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
      }
    if (isCollected)
      return {
        icon: <Ticket className="w-4 h-4" />,
        text: 'Đã Thu Thập',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
      }
    if (coupon.quantity <= 0)
      return {
        icon: <X className="w-4 h-4" />,
        text: 'Hết Mã',
        color: 'bg-red-100 text-red-700 border-red-200',
      }
    return {
      icon: <Ticket className="w-4 h-4" />,
      text: 'Còn Hiệu Lực',
      color: 'bg-green-100 text-green-700 border-green-200',
    }
  }

  const status = getCardStatus()

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-0 transition-all duration-300 ${
        isExpired
          ? 'bg-amber-50 border-amber-200'
          : isUsed
            ? 'bg-purple-50 border-purple-200'
            : isCollected
              ? 'bg-blue-50 border-blue-200'
              : 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      {/* Status badge */}
      <Badge
        className={`absolute top-3 right-3 ${status.color} flex items-center gap-1 px-2 py-1 text-xs font-medium`}
      >
        {status.icon} {status.text}
      </Badge>

      {/* Decorative elements */}
      <div className="absolute -left-6 -top-6 h-12 w-12 rounded-full bg-indigo-100 opacity-70"></div>
      <div className="absolute -right-6 -bottom-6 h-12 w-12 rounded-full bg-purple-100 opacity-70"></div>

      {/* Card content */}
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-full ${
              isExpired
                ? 'bg-amber-100'
                : isUsed
                  ? 'bg-purple-100'
                  : isCollected
                    ? 'bg-blue-100'
                    : 'bg-gradient-to-br from-indigo-100 to-purple-100'
            }`}
          >
            <Ticket
              className={`w-8 h-8 ${
                isExpired
                  ? 'text-amber-500'
                  : isUsed
                    ? 'text-purple-500'
                    : isCollected
                      ? 'text-blue-500'
                      : 'text-indigo-600'
              }`}
            />
          </div>
        </div>

        <div className="text-center mb-4">
          <h2
            className={`text-xl font-bold mb-1 tracking-wide ${
              isExpired || isUsed ? 'text-gray-500' : 'text-indigo-700'
            }`}
          >
            {coupon.code || 'Mã không hợp lệ'}
          </h2>
          <p className="text-sm text-gray-500 italic line-clamp-2 min-h-[2.5rem]">
            {coupon.description || 'Không có mô tả'}
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white px-2 text-xs text-gray-400">chi tiết</div>
          </div>
        </div>

        <div className="space-y-2 text-center mb-4">
          <div
            className={`text-lg font-bold ${isExpired || isUsed ? 'text-gray-500' : 'text-green-600'}`}
          >
            {coupon.discountType === 'percentage'
              ? `Giảm ${coupon.discountAmount}%`
              : `Giảm ${coupon.discountAmount.toLocaleString()}₫`}
          </div>
          <p className="text-sm text-gray-500">
            Đơn tối thiểu:{' '}
            <span className="font-medium">{coupon.minimumPriceToUse.toLocaleString()}₫</span>
          </p>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${coupon.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}
            ></span>
            Còn lại: {coupon.quantity}
          </p>
        </div>

        <div className="mt-4">
          {/* Trường hợp mã còn hiệu lực, chưa sử dụng, chưa thu thập, và còn số lượng */}
          {!isExpired && !isUsed && !isCollected && coupon.quantity > 0 && (
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow"
              onClick={handleCollect}
            >
              📥 Thu Thập Ngay
            </Button>
          )}
          {/* Trường hợp mã còn hiệu lực, chưa sử dụng, chưa thu thập, nhưng hết số lượng */}
          {!isExpired && !isUsed && !isCollected && coupon.quantity <= 0 && (
            <Button className="w-full bg-gray-200 text-gray-500 cursor-not-allowed" disabled>
              Hết Mã
            </Button>
          )}
          {/* Trường hợp mã còn hiệu lực, chưa sử dụng, nhưng đã thu thập */}
          {!isExpired && !isUsed && isCollected && (
            <Button
              className="w-full bg-blue-500 text-white hover:bg-blue-600 cursor-not-allowed"
              disabled
            >
              Đã Thu Thập
            </Button>
          )}
          {/* Trường hợp mã đã sử dụng hoặc đã hết hạn */}
          {(isExpired || isUsed) && (
            <Button
              className={`w-full ${isUsed ? 'bg-purple-500 text-white' : 'bg-amber-500 text-white'} cursor-not-allowed`}
              disabled
            >
              {isUsed ? 'Đã Sử Dụng' : 'Hết Hạn'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
