'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { UserIcon, LogOutIcon, Menu, Frame } from 'lucide-react'
import { ModeToggle } from '@/components/ModeToggle'
import CartSheet from '@/components/CartSheet'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navigation = [
  { name: 'Trang Chủ', href: '/' },
  { name: 'Bộ Sưu Tập', href: '/collections' },
  { name: 'Nước Hoa', href: '/fragrances' },
  { name: 'Khuyến Mãi', href: '/coupons' },
  { name: 'Tài khoản', href: '/account', isLoggedIn: true },
  { name: 'Đơn hàng', href: '/orders', isLoggedIn: true },
  { name: 'Hỗ trợ', href: '/conversations', isLoggedIn: true },
  { name: 'Quản lý', href: '/admin', isLoggedIn: true, isAdmin: true },
]

export default function Header() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const filteredNavigation = navigation.filter((item) => {
    if (item.isLoggedIn && !user) return false
    if (item.isAdmin && (!user || !user.roles?.includes('admin'))) return false
    return true
  })

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">H-Perfume</span>
            <Frame className="text-rose-500 w-10 h-10" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-x-8">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
          {/* Desktop Account Links */}
          <div className="hidden lg:flex items-center gap-4">
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
          </div>

          {/* Always visible items */}
          {user && <CartSheet />}
          <ModeToggle />

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-4">
              <div className="flex flex-col gap-6 mt-6">
                <div className="space-y-4">
                  {filteredNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-base font-semibold leading-7 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="border-t pt-4">
                  {user ? (
                    <div className="space-y-4">
                      <Link
                        href="/account"
                        className="flex items-center gap-2 text-base font-semibold leading-7 text-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <UserIcon className="h-5 w-5" />
                        <span>{user?.name || 'Tài khoản'}</span>
                      </Link>
                      <Link
                        href="/logout"
                        className="flex items-center gap-2 text-base font-semibold leading-7 text-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogOutIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Link
                        href="/login"
                        className="block text-base font-semibold leading-7 text-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/register"
                        className="block text-base font-semibold leading-7 text-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  )
}
