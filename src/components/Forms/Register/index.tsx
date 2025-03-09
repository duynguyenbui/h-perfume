'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PayloadUserSignUpValidator, TPayloadUserSignUpValidator } from '@/validations'
import { useAuth } from '@/providers/AuthProvider'
import { useCallback } from 'react'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function RegisterForm({ className }: { className?: string }) {
  const { create } = useAuth()

  const form = useForm<TPayloadUserSignUpValidator>({
    resolver: zodResolver(PayloadUserSignUpValidator),
    defaultValues: {
      email: 'demo@hperfume.com',
      password: 'demo',
      name: 'Demo',
    },
  })

  const onSubmit = useCallback(
    async (values: TPayloadUserSignUpValidator) => {
      try {
        const res = await create(values)
        if (typeof res === 'object') {
          toast.success('Tài khoản của bạn đã được tạo thành công.')
        } else {
          toast.error(res)
        }
      } catch (_) {
        toast.error('Đã xảy ra lỗi khi tạo tài khoản của bạn.')
      }
    },
    [create],
  )

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Nhập email của bạn bên dưới để đăng ký tài khoản
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} required className="rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              Đăng ký
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center text-sm">
        Bạn đã có tài khoản?{' '}
        <a href="/login" className="underline underline-offset-4">
          Đăng nhập
        </a>
      </div>
    </div>
  )
}
