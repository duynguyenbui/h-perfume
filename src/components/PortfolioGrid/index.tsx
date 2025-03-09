'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const projects = [
  {
    id: 1,
    title: 'Bộ Sưu Tập Mùa Xuân',
    description:
      'Hương thơm nhẹ nhàng, tươi mát với nốt hương hoa và trái cây cho mùa xuân tràn đầy sức sống',
    imageUrl: '/profolio-placeholder.svg?height=600&width=800',
    category: 'Nước Hoa Unisex',
  },
  {
    id: 2,
    title: 'Dòng Nước Hoa Cao Cấp',
    description: 'Bộ sưu tập nước hoa đẳng cấp với hương thơm kéo dài và thiết kế chai sang trọng',
    imageUrl: '/profolio-placeholder.svg?height=800&width=600',
    category: 'Nước Hoa Nam',
  },
  {
    id: 3,
    title: 'Hương Thơm Tinh Tế',
    description: 'Mùi hương tinh tế, quyến rũ với nốt hương hoa hồng và hổ phách cho phái đẹp',
    imageUrl: '/profolio-placeholder.svg?height=600&width=800',
    category: 'Nước Hoa Nữ',
  },
  {
    id: 4,
    title: 'Bộ Quà Tặng Đặc Biệt',
    description: 'Bộ sản phẩm quà tặng hoàn hảo bao gồm nước hoa và các sản phẩm chăm sóc cơ thể',
    imageUrl: '/profolio-placeholder.svg?height=800&width=600',
    category: 'Bộ Quà Tặng',
  },
  {
    id: 5,
    title: 'Dòng Sản Phẩm Organic',
    description: 'Nước hoa được chiết xuất từ các thành phần tự nhiên, an toàn cho làn da nhạy cảm',
    imageUrl: '/profolio-placeholder.svg?height=600&width=800',
    category: 'Hữu Cơ',
  },
  {
    id: 6,
    title: 'Phiên Bản Giới Hạn',
    description:
      'Bộ sưu tập giới hạn với thiết kế độc đáo và hương thơm đặc biệt cho những dịp quan trọng',
    imageUrl: '/profolio-placeholder.svg?height=800&width=600',
    category: 'Phiên Bản Giới Hạn',
  },
]

const categories = ['Tất Cả', ...new Set(projects.map((project) => project.category))]

export default function PortfolioGrid() {
  const [filter, setFilter] = useState('Tất Cả')

  const filteredProjects =
    filter === 'Tất Cả' ? projects : projects.filter((project) => project.category === filter)

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Bộ Sưu Tập Nước Hoa</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Khám phá các dòng nước hoa độc đáo và tinh tế của chúng tôi, được chế tác từ những thành
            phần tốt nhất.
          </p>
        </motion.div>

        <div className="flex justify-center space-x-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.imageUrl || '/placeholder.svg'}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300"
                    whileHover={{ opacity: 1 }}
                  >
                    <p className="text-white text-center px-4">{project.description}</p>
                  </motion.div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-primary mb-1">{project.category}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                  <a
                    href="/fragrances"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Khám Phá Thêm
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
