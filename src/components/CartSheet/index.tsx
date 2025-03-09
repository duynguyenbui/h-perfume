/**
 * v0 by Vercel.
 * @see https://v0.dev/t/VTWGUE55AD7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import XIcon from '@/components/CustomIcon/XIcon'
import { ShoppingCartIcon } from 'lucide-react'

export default function CartSheet() {
  const [cart, setCart] = useState([
    {
      id: 1,
      image: '/cart-placeholder.svg',
      title: 'Nước hoa Nam A',
      quantity: 2,
      price: 1200000,
    },
    {
      id: 2,
      image: '/cart-placeholder.svg',
      title: 'Nước hoa Nữ B',
      quantity: 1,
      price: 1500000,
    },
    {
      id: 3,
      image: '/cart-placeholder.svg',
      title: 'Nước hoa Unisex C',
      quantity: 3,
      price: 2000000,
    },
  ])

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  return (
    <Sheet>
      <SheetTrigger>
        <ShoppingCartIcon className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Giỏ Hàng Của Bạn</SheetTitle>
          <SheetDescription>
            Xem lại các sản phẩm trong giỏ hàng và tiến hành thanh toán khi bạn đã sẵn sàng.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4 p-5">
          {cart.map((item) => (
            <div key={item.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                width={80}
                height={80}
                className="rounded-md object-cover"
                style={{ aspectRatio: '80/80', objectFit: 'cover' }}
              />
              <div className="grid gap-1">
                <h4 className="font-medium">{item.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">SL: {item.quantity}</span>
                  <span className="text-sm font-medium">{formatPrice(item.price)}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Xóa ${item.title} khỏi giỏ hàng`}
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
        <Separator />
        <div className="grid gap-2 py-4 p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium">Tổng cộng</span>
            <span className="text-lg font-medium">{formatPrice(total)}</span>
          </div>
          <Button size="lg">Tiến hành thanh toán</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
