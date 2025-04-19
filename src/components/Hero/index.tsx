'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
          <motion.h1
            className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gradient">H-Perfume</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Khám phá bộ sưu tập nước hoa cao cấp độc quyền của chúng tôi. Mỗi hương thơm kể một câu
            chuyện riêng biệt, được chế tác từ những thành phần tinh túy nhất để tạo nên trải nghiệm
            khứu giác khó quên.
          </motion.p>
          <motion.div
            className="mt-10 flex items-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/collections" className="apple-button">
              Mua Sắm Bộ Sưu Tập
            </Link>
            <Link href="/fragrances" className="text-sm font-semibold leading-6 text-foreground">
              Khám Phá Hương Thơm <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="mx-auto mt-16 lg:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative">
            <img
              src="logo.png"
              alt="Bộ Sưu Tập Nước Hoa Cao Cấp H-Perfume"
              width={600}
              height={600}
              className="w-[500px] rounded-2xl shadow-xl ring-1 ring-gray-900/10"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
