'use client'

import { Media } from '@/payload-types'
import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
interface ImageSliderProps {
  images: (string | Media)[]
  autoSlide?: boolean
  autoSlideInterval?: number
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  autoSlide = true,
  autoSlideInterval = 3000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length)
  }

  useEffect(() => {
    if (!autoSlide) return

    const intervalId = setInterval(() => {
      nextSlide()
    }, autoSlideInterval)

    return () => clearInterval(intervalId)
  }, [autoSlide, autoSlideInterval, images.length])

  const getImageUrl = (image: string | Media): string => {
    const imageUrl = typeof image === 'object' ? image.url : image
    return imageUrl || '/placeholder.svg?height=400&width=600'
  }

  const minSwipeDistance = 50 // Minimum distance to consider it a swipe

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const velocity = Math.abs(distance) / 100 // Rough estimate of swipe velocity
    const isQuickSwipe = velocity > 0.5 // Threshold for quick swipe

    // Adjust sensitivity based on swipe velocity
    const threshold = isQuickSwipe ? minSwipeDistance / 2 : minSwipeDistance

    const isLeftSwipe = distance > threshold
    const isRightSwipe = distance < -threshold

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  return (
    <div className="relative w-full h-full" ref={sliderRef}>
      {images.map((image, index) => {
        const imageUrl = getImageUrl(image)
        return (
          <div
            key={index}
            className={cn(
              'absolute top-0 left-0 w-full h-full transition-opacity duration-500',
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0',
            )}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={imageUrl || '/placeholder.svg'}
              alt={`Slide ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority={index === 0}
              className={cn('object-cover', isLoading && 'animate-pulse bg-muted')}
              onLoadingComplete={() => setIsLoading(false)}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.svg?height=400&width=600'
              }}
            />
          </div>
        )
      })}
      <div className="absolute top-1/2 left-0 w-full flex justify-between items-center transform -translate-y-1/2 z-20">
        <button
          onClick={prevSlide}
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80 ml-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80 mr-2"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default ImageSlider
