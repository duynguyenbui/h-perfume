'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { CollectionCard } from '../CollectionCard'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getValidCollections } from '@/actions/collections'
import { Collection } from '@/payload-types'
import { toast } from 'sonner'

export function CollectionCarousel() {
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    getValidCollections()
      .then((collections) => {
        setCollections(collections)
        toast.success('Lấy bộ sưu tập thành công')
      })
      .catch((error) => {
        toast.error('Lỗi khi lấy bộ sưu tập')
        console.error(error)
      })
  }, [])

  return (
    <Carousel className="w-full max-w-6xl">
      <CarouselContent>
        {collections.map((item) => (
          <CarouselItem className="md:basis-1/3 p-4" key={item.id}>
            <CollectionCard Icon={Heart} title={item.name} description={item.description} id={item.id} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-background/80 hover:bg-background" />
      <CarouselNext className="right-2 bg-background/80 hover:bg-background" />
    </Carousel>
  )
}
