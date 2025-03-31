'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCollectedCoupons } from '@/actions/coupons'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/button'
import { Coupon as PayloadCoupon } from '@/payload-types'
import { CheckedState } from '@radix-ui/react-checkbox'

interface CouponSectionProps {
  form: any
  totalPrice: number
  setDiscountAmount: (amount: number, coupons: PayloadCoupon[]) => void // Đảm bảo prop nhận cả coupons
}

export default function CouponSection({ form, totalPrice, setDiscountAmount }: CouponSectionProps) {
  const { user } = useAuth()
  const [coupons, setCoupons] = useState<PayloadCoupon[]>([])
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCouponDetails, setSelectedCouponDetails] = useState<PayloadCoupon[]>([])

  useEffect(() => {
    if (user && totalPrice > 0) {
      getCollectedCoupons({ minimumPrice: totalPrice }).then((res) => {
        if (res.success) {
          setCoupons(res.data || [])
        } else {
          toast.error(res.message)
        }
      })
    }
  }, [user, totalPrice])

  const calculateDiscount = (coupons: PayloadCoupon[], total: number) => {
    return coupons.reduce((acc, coupon) => {
      if (coupon.discountType === 'percentage') {
        return acc + (total * coupon.discountAmount) / 100
      } else if (coupon.discountType === 'fixed') {
        return acc + coupon.discountAmount
      }
      return acc
    }, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const handleCouponSelection = (couponId: string) => {
    if (selectedCoupons.includes(couponId)) {
      setSelectedCoupons(selectedCoupons.filter((id) => id !== couponId))
    } else {
      setSelectedCoupons([...selectedCoupons, couponId])
    }
  }

  const applyCoupons = () => {
    const selected = coupons.filter((coupon) => selectedCoupons.includes(coupon.id))
    setSelectedCouponDetails(selected)
    const discount = calculateDiscount(selected, totalPrice)
    setDiscountAmount(discount, selected) // Truyền cả danh sách coupon đã chọn lên parent
    form.setValue('couponId', selectedCoupons.length > 0 ? selectedCoupons[0] : undefined)
    form.trigger()
    setIsModalOpen(false)
  }

  const freeCoupons = coupons.filter((coupon) => coupon.minimumPriceToUse === 0)
  const paidCoupons = coupons.filter((coupon) => coupon.minimumPriceToUse > 0)

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="border-b pb-2">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Mã Khuyến Mãi Đã Thu Thập
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <FormField
          control={form.control}
          name="couponId"
          render={({ field }) => (
            <FormItem>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full text-left justify-start">
                    {selectedCoupons.length > 0
                      ? selectedCoupons
                          .map((id) => coupons.find((c) => c.id === id)?.code)
                          .join(', ')
                      : 'Chọn mã khuyến mãi đã thu thập'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Chọn Mã Khuyến Mãi Đã Thu Thập</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-2">🎉 Mã Miễn Phí</h3>
                      {freeCoupons.length > 0 ? (
                        freeCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="flex items-center space-x-3 py-2 border-b"
                          >
                            <Checkbox
                              checked={selectedCoupons.includes(coupon.id)}
                              onCheckedChange={(checked: CheckedState) => {
                                if (typeof checked === 'boolean') {
                                  handleCouponSelection(coupon.id)
                                }
                              }}
                            />
                            <div>
                              <p className="font-medium">{coupon.code}</p>
                              <p className="text-sm text-gray-600">
                                Giảm:{' '}
                                {coupon.discountType === 'percentage'
                                  ? `${coupon.discountAmount}%`
                                  : formatPrice(coupon.discountAmount)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Bạn chưa thu thập mã miễn phí nào.</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-2">💸 Mã Theo Giá</h3>
                      {paidCoupons.length > 0 ? (
                        paidCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="flex items-center space-x-3 py-2 border-b"
                          >
                            <Checkbox
                              checked={selectedCoupons.includes(coupon.id)}
                              onCheckedChange={(checked: CheckedState) => {
                                if (typeof checked === 'boolean') {
                                  handleCouponSelection(coupon.id)
                                }
                              }}
                            />
                            <div>
                              <p className="font-medium">{coupon.code}</p>
                              <p className="text-sm text-gray-600">
                                Giảm:{' '}
                                {coupon.discountType === 'percentage'
                                  ? `${coupon.discountAmount}%`
                                  : formatPrice(coupon.discountAmount)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Đơn tối thiểu: {coupon.minimumPriceToUse.toLocaleString()} VND
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Bạn chưa thu thập mã theo giá nào.</p>
                      )}
                    </div>

                    <Button onClick={applyCoupons} className="w-full">
                      Áp dụng
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCouponDetails.length > 0 && (
          <div className="p-4 bg-gray-100 rounded-md">
            {selectedCouponDetails.map((coupon) => (
              <div key={coupon.id} className="mb-2">
                <p className="text-sm text-gray-700">
                  📢 <strong>{coupon.description || 'Không có mô tả'}</strong>
                </p>
                <p className="text-sm">
                  Giảm giá:{' '}
                  <strong>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountAmount}%`
                      : formatPrice(coupon.discountAmount)}
                  </strong>
                </p>
                <p className="text-sm">
                  Đơn tối thiểu: <strong>{coupon.minimumPriceToUse.toLocaleString()} VND</strong>
                </p>
                <p className="text-sm">
                  Số lượng còn: <strong>{coupon.quantity}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
