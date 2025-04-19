'use client'

import type React from 'react'
import { motion } from 'framer-motion'
import { MouseIcon, type LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

interface CollectionCardProps {
  Icon: LucideIcon
  id: string
  title: string
  description: string
  imageUrl?: string
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  Icon,
  id,
  title,
  description,
  imageUrl,
}) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/fragrances?collection=${id}`)
    toast.success(`Đã chuyển đến bộ sưu tập ${title}`)
  }

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="rounded-xl p-6 shadow-md cursor-pointer w-64 h-72 flex flex-col justify-between 
        bg-white dark:bg-gray-800 
        border border-gray-100 dark:border-gray-700
        transition-colors duration-300"
    >
      <div className="flex flex-col items-center text-center">
        {imageUrl ? (
          <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
            <Image
              src={imageUrl || '/placeholder.svg'}
              alt={`${title} collection`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="w-10 h-10 text-primary" />
          </div>
        )}
        <h2 className="text-xl font-semibold mb-2 font-figtree text-indigo-700">{title}</h2>
        <p className="text-sm font-figtree font-light text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
      <div className="mt-4 flex gap-2 text-indigo-700 text-sm font-figtree font-medium">
        <MouseIcon className="size-4" />
        <span>Click Me</span>
      </div>
    </motion.div>
  )
}
