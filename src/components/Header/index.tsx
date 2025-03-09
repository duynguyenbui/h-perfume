'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { UserIcon, LogOutIcon } from 'lucide-react'
import { ModeToggle } from '@/components/ModeToggle'
import CartSheet from '@/components/CartSheet'

const navigation = [
  { name: 'Trang Chủ', href: '/' },
  { name: 'Bộ Sưu Tập', href: '/collections' },
  { name: 'Nước Hoa', href: '/fragrances' },
  { name: 'Tài khoản', href: '/account', isLoggedIn: true },
  { name: 'Đơn hàng', href: '/orders', isLoggedIn: true },
  { name: 'Quản lý', href: '/admin', isLoggedIn: true, isAdmin: true },
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
            <img
              className="h-8 w-auto"
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/creative-SW6QDQbcVuwPgb6a2CYtYmRbsJa4k1.png"
              alt="H-Perfume Logo"
            />
          </Link>
        </div>
        <div className="flex gap-x-12">
          {navigation
            .filter((item) => {
              if (item.isLoggedIn && !user) return false;
              if (item.isAdmin && (!user || !user.roles?.includes('admin'))) return false;
              return true;
            })
            .map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
        </div>
        <div className="flex flex-1 justify-end items-center gap-4">
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
                <span>Đăng xuất</span>
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
