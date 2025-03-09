'use client'

// @ts-nocheck
import { LogOutIcon } from '@/components/CustomIcon/LogoutIcon'
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/EXdet7CS2Qj
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/AuthProvider'
import { LogInIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function Page() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      Promise.resolve(logout())
        .then(() => {
          toast.success('Bạn đã đăng xuất thành công.')
        })
        .catch((_) => {
          toast.error('Đã xảy ra lỗi trong quá trình đăng xuất.')
        })
    } else {
      toast.info('Bạn đã đăng xuất rồi.')
    }
  }, [logout, user])

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <LogOutIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Đang đăng xuất
        </h1>
        <p className="mt-4 text-muted-foreground">
          Bạn sắp đăng xuất khỏi tài khoản của mình. Bạn có chắc chắn muốn tiếp tục không?
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <Button
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => {
              router.push('/')
            }}
          >
            Trang chủ
          </Button>

          <Button
            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => {
              router.push('/login')
            }}
            variant="outline"
          >
            Đăng nhập
            <LogInIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
