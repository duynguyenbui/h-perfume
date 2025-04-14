'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const total: string | null = searchParams?.get('total') ?? null
  const paymentMethod: string | null = searchParams?.get('method') ?? null
  const [countdown, setCountdown] = useState<number>(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      router.push('/orders')
    }
  }, [countdown, router])

  const formatPrice = (price: string | null) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(price))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CheckCircle className="h-8 w-8 text-green-500" />
            Đã đặt hàng thành công!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">
            Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được xử lý thành công.
          </p>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Tổng tiền:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phương thức thanh toán:</span>
              <span>{paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Momo'}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Bạn sẽ được chuyển hướng đến trang đơn hàng sau {countdown} giây...
          </p>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/orders')} className="bg-black hover:bg-gray-800">
              Xem đơn hàng
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Tiếp tục mua sắm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
