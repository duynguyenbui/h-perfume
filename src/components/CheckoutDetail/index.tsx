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

export default function CheckoutDetail() {
  const { user } = useAuth()
  const { lineItems, clearCart } = useCart()
  const router = useRouter()

  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([])
  const [shippingFee, setShippingFee] = useState<ShippingFee | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const form = useForm<TPayloadCheckoutValidator>({
    resolver: zodResolver(PayloadCheckoutValidator),
    defaultValues: {
      lineItems: lineItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      paymentMethod: 'stripe',
    },
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  useEffect(() => {
    if (user) {
      getShippingAddresses().then((res) => {
        if (res.success) {
          setShippingAddresses(res.data || [])
        } else {
          toast.error(res.message)
        }
      })
    }
  }, [user])

  useEffect(() => {
    if (lineItems.length) {
      const subtotal = lineItems.reduce((acc, item) => {
        return acc + (item.price - (item.price * item.discount) / 100) * item.quantity
      }, 0)

      setTotalPrice(subtotal)

      getShippingFeeByMinimumPrice({ minimumPrice: subtotal }).then((res) => {
        if (res.success) {
          setShippingFee(res.data || null)
          if (res.data) {
            form.setValue('shippingFeeId', res.data.id)
          }
        } else {
          toast.error(res.message)
        }
      })
    }
  }, [lineItems, form])

  useEffect(() => {
    form.setValue(
      'lineItems',
      lineItems.map((item) => ({ id: item.id, quantity: item.quantity })),
    )
  }, [lineItems, form])

  const onSubmit = (data: TPayloadCheckoutValidator) => {
    const { success } = PayloadCheckoutValidator.safeParse(data)

    if (!success) {
      toast.error('Vui lòng kiểm tra lại thông tin đơn hàng')
      return
    }

    createOrder(data).then((res) => {
      if (res.success) {
        toast.success('Đơn hàng đã được tạo thành công!')
        clearCart()
        router.push('/orders')
      } else {
        toast.error(res.message)
      }
    })
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn mã khuyến mãi" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px] w-full overflow-y-auto">
                              <SelectItem value="1">GIAMGIA10</SelectItem>
                              <SelectItem value="2">FREESHIP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                            onValueChange={field.onChange}
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
                              <RadioGroupItem value="stripe" id="stripe" />
                              <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                                <div className="font-medium">Thanh Toán Online</div>
                                <div className="text-sm text-muted-foreground">
                                  Thanh toán qua Stripe
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
                <CardHeader className=" border-b pb-2">
                  <CardTitle className="text-xl">Tổng Đơn Hàng</CardTitle>
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
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>{formatPrice(shippingFee?.fee || 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(totalPrice + (shippingFee?.fee || 0))}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    type="submit"
                    className="w-full py-6 text-lg"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Đang xử lý...' : 'Thanh Toán'}
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
