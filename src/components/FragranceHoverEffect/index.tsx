'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Fragrance } from '@/payload-types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '../ui/badge'

export const FragranceHoverEffect = ({
  items,
  className,
}: {
  items: Fragrance[]
  className?: string
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 py-10', className)}>
      {items.map((item, idx) => (
        <div
          key={item?.id}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl z-10"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="h-full w-full border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20 bg-black text-white">
            <CardHeader>
              <CardTitle className="text-zinc-100 font-bold tracking-wide gap-2 items-center flex">
                {item.name}
                <Badge variant="destructive">{item.concentration}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1 mb-1">
                <span className="font-bold text-lg">{item.brand}</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-400">{item.origin}</span>
                  <span className="text-zinc-400">• </span>
                  <span className="text-zinc-400 capitalize">{item.longevity}</span>
                </div>
              </div>
              <CardDescription className="text-zinc-400">
                {item.description || 'H-Perfume'}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    item.discount > 0 ? 'line-through text-zinc-500 text-sm' : 'text-zinc-100',
                  )}
                >
                  ${item.price.toFixed(2)}
                </span>
                {item.discount > 0 && (
                  <span className="text-zinc-100">
                    ${(item.price - (item.price * item.discount) / 100).toFixed(2)}
                  </span>
                )}
              </div>
              <Link
                href={`/fragrances/${item?.id}`}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
              >
                chi tiết
                <ShoppingBag className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  )
}
