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
import { ShoppingCartIcon, Trash, Plus, Minus } from 'lucide-react'
import { useCart } from '@/stores/CartStore'
import { useRouter } from 'next/navigation'

export default function CartSheet() {
  const { lineItems, removeLineItem, plusLineItem, minusLineItem } = useCart()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const total = lineItems.reduce((acc, item) => {
    return acc + item.price * item.quantity - (item.discount * item.quantity * item.price) / 100
  }, 0)

  return (
    <Sheet>
      <SheetTrigger>
        <div className="relative">
          <ShoppingCartIcon className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-primary text-[10px] flex items-center justify-center text-white dark:text-black">
            {lineItems.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Giỏ Hàng Của Bạn</SheetTitle>
          <SheetDescription>
            Xem lại các sản phẩm trong giỏ hàng và tiến hành thanh toán khi bạn đã sẵn sàng.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4 p-5">
          {lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-1 items-center gap-4 border-b p-2">
              <div className="grid gap-1">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">SL: {item.quantity}</span>
                  <span className="text-sm font-medium">
                    {formatPrice(item.price - item.discount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}>
                    <Trash className="h-5 w-5 text-red-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => plusLineItem(item.id)}>
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => minusLineItem(item.id)}>
                    <Minus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="grid gap-2 py-4 p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium">Tổng cộng</span>
            <span className="text-lg font-medium">{formatPrice(total)}</span>
          </div>
          <Button size="lg" onClick={() => router.push('/checkout')}>
            Tiến hành thanh toán
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
