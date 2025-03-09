'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PayloadUserLoginValidator, TPayloadUserLoginValidator } from '@/validations'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function LoginForm({ className }: { className?: string }) {
  const { login } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = useRef(searchParams?.get('redirect'))

  const form = useForm<TPayloadUserLoginValidator>({
    resolver: zodResolver(PayloadUserLoginValidator),
    defaultValues: {
      email: 'user@hperfume.com',
      password: 'user',
    },
  })

  const onSubmit = useCallback(
    async (values: TPayloadUserLoginValidator) => {
      try {
        const user = await login(values)

        if (user) {
          router.push(redirect.current || '/')
        } else {
          toast.error('Đã xảy ra lỗi với thông tin đăng nhập. Vui lòng thử lại.')
        }
      } catch (_) {
        toast.error('Đã xảy ra lỗi.')
      }
    },
    [login, router],
  )

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đăng nhập vào tài khoản</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Nhập email của bạn bên dưới để đăng nhập vào tài khoản
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} required className="rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-2 mt-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Mật khẩu</FormLabel>
                      <a href="#" className="text-sm underline-offset-4 hover:underline">
                        Quên mật khẩu?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Nhập mật khẩu của bạn"
                        type="password"
                        {...field}
                        required
                        className="rounded-md"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Đăng nhập
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center text-sm">
        Bạn chưa có tài khoản?{' '}
        <a href="/register" className="underline underline-offset-4">
          Đăng ký
        </a>
      </div>
    </div>
  )
}
