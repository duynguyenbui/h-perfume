'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { UserIcon, LogOutIcon, Frame } from 'lucide-react'
import { ModeToggle } from '@/components/ModeToggle'
import CartSheet from '@/components/CartSheet'

const navigation = [
  { name: 'Trang Chủ', href: '/' },
  { name: 'Bộ Sưu Tập', href: '/collections' },
  { name: 'Nước Hoa', href: '/fragrances' },
  { name: 'Khuyến Mãi', href: '/coupons' },
  { name: 'Tài khoản', href: '/account', isLoggedIn: true },
  { name: 'Đơn hàng', href: '/orders', isLoggedIn: true },
  { name: 'Hỗ trợ', href: '/conversations', isLoggedIn: true },
  { name: 'Quản lý', href: '/admin', isLoggedIn: true, isAdmin: true },
  { name: 'Thống kê', href: '/statistics', isLoggedIn: true, isAdmin: true },
]

export default function Header() {
  const { user } = useAuth()

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">H-Perfume</span>
            <img className="h-20 w-auto" src="/logo.png" alt="H-Perfume Logo" />
          </Link>
        </div>
        <div className="flex gap-4">
          {navigation
            .filter((item) => {
              if (item.isLoggedIn && !user) return false // Không đăng nhập thì không hiện các mục yêu cầu đăng nhập
              if (item.isAdmin && (!user || !user.roles?.includes('admin'))) return false // Không phải admin thì không hiện "Quản lý"
              return true
            })
            .map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors underline"
              >
                {item.name}
              </Link>
            ))}
        </div>
        <div className="flex flex-1 justify-end items-center gap-3">
          {user ? (
            <>
              <Link
                href="/account"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <UserIcon className="h-4 w-4" />
                <span>{user?.name || 'Tài khoản'}</span>
              </Link>
              <Link
                href="/logout"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <LogOutIcon className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                Đăng ký
              </Link>
            </>
          )}
          {user && <CartSheet />}
          <ModeToggle />
        </div>
      </nav>
    </motion.header>
  )
}
