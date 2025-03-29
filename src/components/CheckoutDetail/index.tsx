'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useCart } from '@/stores/CartStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { MapPin, CreditCard, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { getShippingAddresses } from '@/actions/addresses'
import { ShippingAddress, ShippingFee } from '@/payload-types'
import { toast } from 'sonner'
import { getShippingFeeByMinimumPrice } from '@/actions/shippingFees'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PayloadCheckoutValidator } from '@/validations'
import { TPayloadCheckoutValidator } from '@/validations'
import { useForm } from 'react-hook-form'
import { createOrder } from '@/actions/orders'
import { useRouter } from 'next/navigation'
import { getValidCoupons } from '@/actions/coupons'
import { CreateMomoPaymentRequest } from '@/types/momo'

export default function CheckoutDetail() {
  const { user } = useAuth()
  const { lineItems, clearCart } = useCart()
  const router = useRouter()

  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([])
  const [shippingFee, setShippingFee] = useState<ShippingFee | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [coupons, setCoupons] = useState<{ id: string; code: string; discountAmount: number }[]>([])
  const [selectedCouponDetails, setSelectedCouponDetails] = useState<any>(null)
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null)

  const totalBeforeCoupon = totalPrice + (shippingFee?.fee || 0)
  const totalAfterCoupon = Math.max(totalBeforeCoupon - discountAmount, 0)

  const form = useForm<TPayloadCheckoutValidator>({
    resolver: zodResolver(PayloadCheckoutValidator),
    defaultValues: {
      lineItems: lineItems.length
        ? lineItems.map((item) => ({ id: item.id, quantity: item.quantity }))
        : [{ id: 'placeholder', quantity: 1 }],
      paymentMethod: 'cod',
      shippingAddressId: '',
      shippingFeeId: '',
      couponId: undefined,
    },
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  useEffect(() => {
    if (user) {
      getShippingAddresses().then((res) => {
        if (res.success && res.data?.length) {
          setShippingAddresses(res.data)
          if (!form.getValues('shippingAddressId')) {
            form.setValue('shippingAddressId', res.data[0].id)
          }
        } else {
          toast.error(res.message)
        }
        form.trigger() // Kích hoạt validation toàn bộ form
      })
    }
  }, [user, form])

  useEffect(() => {
    if (lineItems.length) {
      const subtotal = lineItems.reduce((acc, item) => {
        return acc + (item.price - (item.price * item.discount) / 100) * item.quantity
      }, 0)
      setTotalPrice(subtotal)

      getShippingFeeByMinimumPrice({ minimumPrice: subtotal }).then((res) => {
        if (res.success && res.data) {
          setShippingFee(res.data)
          form.setValue('shippingFeeId', res.data.id)
        } else {
          toast.error(res.message)
        }
        form.trigger() // Kích hoạt validation toàn bộ form
      })
    }
  }, [lineItems, form])

  useEffect(() => {
    const updatedLineItems = lineItems.map((item) => ({ id: item.id, quantity: item.quantity }))
    form.setValue('lineItems', updatedLineItems)
    form.trigger() // Kích hoạt validation toàn bộ form
  }, [lineItems, form])

  useEffect(() => {
    if (user && totalPrice > 0) {
      getValidCoupons({ minimumPrice: totalPrice }).then((res) => {
        if (res.success) {
          setCoupons(res.data || [])
        } else {
          toast.error(res.message)
        }
      })
    }
  }, [user, totalPrice])

  const calculateDiscount = (coupon: any, total: number) => {
    if (coupon.discountType === 'percentage') {
      const discount = (total * coupon.discountAmount) / 100
      return discount
    } else if (coupon.discountType === 'fixed') {
      return coupon.discountAmount
    }
    return 0
  }

  const onSubmit = async (data: TPayloadCheckoutValidator) => {
    const { success, error } = PayloadCheckoutValidator.safeParse(data)
    if (!success) {
      toast.error('Vui lòng kiểm tra lại thông tin đơn hàng')
      return
    }

    const orderId = `ORDER-${Date.now()}`

    const orderData = {
      orderId,
      lineItems: data.lineItems,
      paymentMethod: data.paymentMethod,
      shippingAddressId: data.shippingAddressId,
      shippingFeeId: data.shippingFeeId,
      couponId: data.couponId,
    }

    try {
      if (data.paymentMethod === 'momo') {
        console.log('Xử lý thanh toán Momo')
        const requestBody: CreateMomoPaymentRequest = {
          amount: totalAfterCoupon,
          orderId,
          returnUrl: `${window.location.origin}/orders`,
          userId: user?.id || '',
          lineItems: lineItems.map((item) => ({
            id: item.id, // Sửa lại để khớp với CreateMomoPaymentRequest
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            versionOfFragrance: 'default',
          })),
          shippingAddressId: data.shippingAddressId,
          shippingFeeId: data.shippingFeeId,
          couponId: data.couponId,
          paymentMethod: data.paymentMethod,
        }
        console.log('Request body gửi đến endpoints/momo', requestBody)

        const response = await fetch('endpoints/momo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })

        const result = await response.json()
        console.log('Kết quả từ endpoints/momo:', result)

        if (result.success && result.payUrl) {
          console.log('Chuyển hướng đến trang thanh toán Momo:', result.payUrl)
          window.location.href = result.payUrl
        } else {
          console.log('Thất bại khi tạo liên kết Momo:', result.message)
          toast.error('Không thể tạo liên kết thanh toán Momo. Vui lòng thử lại.')
        }
      } else {
        console.log('Xử lý thanh toán COD')
        const res = await createOrder(orderData)
        console.log('Kết quả createOrder:', res)
        if (res.success) {
          console.log('Tạo đơn hàng COD thành công')
          toast.success('Đơn hàng đã được tạo thành công!')
          clearCart()
          router.push('/orders')
        } else {
          console.log('Thất bại khi tạo đơn hàng COD:', res.message)
          toast.error(res.message)
        }
      }
    } catch (error) {
      console.error('Lỗi trong onSubmit:', error)
      toast.error('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.')
    }
  }

  if (!lineItems.length) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Thanh Toán</h1>
        <p className="text-center">Không có sản phẩm trong giỏ hàng</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Thanh Toán</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart and Shipping Details */}
            <div className="lg:w-2/3 space-y-6">
              <Card className="shadow-md">
                <CardHeader className="border-b pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Giỏ Hàng Của Bạn
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nước Hoa</TableHead>
                          <TableHead className="text-center">Số Lượng</TableHead>
                          <TableHead className="text-right">Giá</TableHead>
                          <TableHead className="text-right">Giảm giá (%)</TableHead>
                          <TableHead className="text-right">Tổng</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                            <TableCell className="text-right">{item.discount}%</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatPrice(
                                (item.price - (item.price * item.discount) / 100) * item.quantity,
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col md:flex-row gap-4">
                <Card className="shadow-md w-full md:w-1/2">
                  <CardHeader className="border-b pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Địa Chỉ Giao Hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="shippingAddressId"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              console.log('Chọn địa chỉ giao hàng:', value)
                              form.trigger() // Kích hoạt validation sau khi chọn
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn địa chỉ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px] w-full overflow-y-auto">
                              {shippingAddresses.map((address) => (
                                <SelectItem key={address.id} value={address.id}>
                                  {address.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-md w-full md:w-1/2">
                  <CardHeader className="border-b pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Mã Khuyến Mãi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="couponId"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedCoupon(value)
                              const coupon = coupons.find((c) => c.id === value)
                              setSelectedCouponDetails(coupon || null)
                              const discount = coupon ? calculateDiscount(coupon, totalPrice) : 0
                              setDiscountAmount(discount)

                              form.trigger() // Kích hoạt validation sau khi chọn
                            }}
                            value={selectedCoupon || field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn mã khuyến mãi" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px] w-full overflow-y-auto">
                              {coupons.length > 0 ? (
                                coupons.map((coupon) => (
                                  <SelectItem key={coupon.id} value={coupon.id}>
                                    {coupon.code}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="p-2 text-center text-gray-500">
                                  Không có mã giảm giá hợp lệ
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedCoupon && selectedCouponDetails && (
                      <div className="p-4 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-700">
                          📢 <strong>{selectedCouponDetails?.description}</strong>
                        </p>
                        <p className="text-sm">
                          Giảm giá:{' '}
                          <strong>
                            {selectedCouponDetails.discountType === 'percentage'
                              ? `${selectedCouponDetails.discountAmount}%`
                              : formatPrice(selectedCouponDetails.discountAmount)}
                          </strong>
                        </p>
                        <p className="text-sm">
                          Đơn tối thiểu:{' '}
                          <strong>
                            {selectedCouponDetails?.minimumPriceToUse.toLocaleString()} VND
                          </strong>
                        </p>
                        <p className="text-sm">
                          Số lượng còn: <strong>{selectedCouponDetails?.quantity}</strong>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-md">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2 pb-2">
                    <CreditCard className="h-5 w-5" />
                    Phương Thức Thanh Toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value)

                              form.trigger() // Kích hoạt validation sau khi chọn
                            }}
                            defaultValue={field.value}
                            className="space-y-4"
                          >
                            <div className="flex items-center space-x-3 border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                              <RadioGroupItem value="cod" id="cod" />
                              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                <div className="font-medium">COD (Thanh Toán Khi Nhận Hàng)</div>
                                <div className="text-sm text-muted-foreground">
                                  Thanh toán bằng tiền mặt khi nhận hàng
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                              <RadioGroupItem value="momo" id="momo" />
                              <Label htmlFor="momo" className="flex-1 cursor-pointer">
                                <div className="font-medium">Thanh Toán Online</div>
                                <div className="text-sm text-muted-foreground">
                                  Thanh toán qua Momo
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-1/3 space-y-6">
              <Card className="shadow-md sticky top-4">
                <CardHeader className="border-b pb-2">
                  <CardTitle className="text-xl">Tổng cộng</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thuế (10%)</span>
                      <span>Đã bao gồm trong tạm tính</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giảm giá (Coupon)</span>
                      <span>
                        -{formatPrice(discountAmount)}
                        {selectedCouponDetails?.discountType === 'percentage' && (
                          <span className="ml-1">({selectedCouponDetails.discountAmount}%)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>{formatPrice(shippingFee?.fee || 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(totalAfterCoupon)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    type="submit"
                    className="w-full py-6 text-lg bg-black hover:bg-gray-800"
                    size="lg"
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      'Thanh Toán'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
