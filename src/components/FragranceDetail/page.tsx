'use client'

import { ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { Fragrance } from '@/payload-types'
import { getFragranceById } from '@/actions/fragrances'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ImageSlider from '../ImageSlider'
import { useCart } from '@/stores/CartStore'
import { Input } from '../ui/input'
export default function FragranceDetail({ fragranceId }: { fragranceId: string }) {
  const [quantity, setQuantity] = useState(1)
  const [fragrance, setFragrance] = useState<Fragrance | null>(null)
  const { addLineItem } = useCart()

  useEffect(() => {
    getFragranceById({ fragranceId }).then((res) => {
      const { success, data, message } = res
      if (success) {
        setFragrance(data)
        toast.success(message)
      } else {
        toast.error(message)
      }
    })
  }, [])

  const handleAddToCart = () => {
    if (!fragrance) return

    const isValidPurchase =
      quantity > 0 &&
      quantity <= fragrance.quantity &&
      fragrance.isActive &&
      fragrance.price > 0 &&
      fragrance.name &&
      fragrance.id

    if (!isValidPurchase) return

    addLineItem({
      id: fragrance.id,
      name: fragrance.name,
      price: fragrance.price,
      discount: fragrance.discount,
      quantity,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
            <ImageSlider images={fragrance?.images || []} />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{fragrance?.name}</h1>
            <p className="text-lg text-muted-foreground">{fragrance?.concentration}</p>
          </div>

          <div>
            <p className="text-3xl font-bold">
              {fragrance ? (
                <>
                  <span
                    className={cn(
                      fragrance.discount > 0
                        ? 'line-through text-zinc-500 text-sm mr-2'
                        : 'text-zinc-100',
                    )}
                  >
                    ₫{fragrance.price.toFixed(2)}
                  </span>
                  {fragrance.discount > 0 && (
                    <span>
                      ₫{(fragrance.price - (fragrance.price * fragrance.discount) / 100).toFixed(2)}
                    </span>
                  )}
                </>
              ) : (
                '₫0'
              )}
            </p>
            <p className="text-sm text-muted-foreground">Giá đã bao gồm thuế</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex gap-2">
              <div>
                <label htmlFor="size" className="block text-sm font-medium mb-2">
                  Kích thước (ml)
                </label>
                <Input
                  disabled
                  className="border-2 hover:border-primary hover:bg-primary/5"
                  defaultValue={fragrance?.volume || ''}
                />
              </div>
              <div>
                <label htmlFor="size" className="block text-sm font-medium mb-2">
                  Số lượng
                </label>
                <Input
                  type="number"
                  className="border-2 hover:border-primary hover:bg-primary/5"
                  max={fragrance?.quantity || 1}
                  defaultValue={quantity || 1}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 gap-2" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Mô tả</h3>
                  <p className="text-sm text-muted-foreground">{fragrance?.description}</p>
                </Card>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Độ lưu hương</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {fragrance?.longevity}
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Xuất xứ</h3>
                    <p className="text-sm text-muted-foreground">{fragrance?.origin}</p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Thương hiệu</h3>
                    <p className="text-sm text-muted-foreground">{fragrance?.brand}</p>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Hương đầu</h3>
                  <p className="text-sm text-muted-foreground">{fragrance?.scentNotes.topNotes}</p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Hương giữa</h3>
                  <p className="text-sm text-muted-foreground">
                    {fragrance?.scentNotes.middleNotes}
                  </p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Hương cuối</h3>
                  <p className="text-sm text-muted-foreground">{fragrance?.scentNotes.baseNotes}</p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Nồng độ</h3>
                  <p className="text-sm text-muted-foreground">{fragrance?.concentration}</p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
