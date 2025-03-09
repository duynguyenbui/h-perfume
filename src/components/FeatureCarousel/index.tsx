'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation, useMotionValue } from 'framer-motion'

const features = [
  {
    title: 'Nguyên Liệu Cao Cấp',
    description: 'Được chế tác từ những nguyên liệu thô tốt nhất được thu thập từ khắp nơi trên thế giới.',
    icon: '🌿',
  },
  {
    title: 'Hương Thơm Bền Lâu',
    description: 'Nước hoa của chúng tôi được thiết kế để lưu hương suốt cả ngày dài.',
    icon: '⏱️',
  },
  {
    title: 'Hỗn Hợp Độc Quyền',
    description: 'Những công thức độc đáo được tạo ra bởi các bậc thầy nước hoa cho trải nghiệm đặc biệt.',
    icon: '✨',
  },
  {
    title: 'Bao Bì Bền Vững',
    description: 'Chai và bao bì thân thiện với môi trường, góp phần bảo vệ hành tinh của chúng ta.',
    icon: '🌍',
  },
  {
    title: 'Không Thử Nghiệm Trên Động Vật',
    description: 'Tất cả sản phẩm của chúng tôi được sản xuất có đạo đức mà không cần thử nghiệm trên động vật.',
    icon: '🐇',
  },
]

export default function FeatureCarousel() {
  const [width, setWidth] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [])

  const handleDragEnd = () => {
    const currentX = x.get()
    if (currentX > 0) {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } })
    } else if (currentX < -width) {
      controls.start({ x: -width, transition: { type: 'spring', stiffness: 300, damping: 30 } })
    }
  }

  return (
    <div className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Điều Khác Biệt Của H-Perfume</h2>
        <motion.div ref={carousel} className="cursor-grab overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            whileTap={{ cursor: 'grabbing' }}
            animate={controls}
            style={{ x }}
            onDragEnd={handleDragEnd}
            className="flex"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="min-w-[300px] h-[400px] p-8 m-4 bg-background rounded-3xl shadow-lg flex flex-col justify-between hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10"
              >
                <div>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                <div className="mt-4">
                  <a
                    href="/fragrances"
                    className="text-primary hover:underline"
                  >
                    Khám phá bộ sưu tập →
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
