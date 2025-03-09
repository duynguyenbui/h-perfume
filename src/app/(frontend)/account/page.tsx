'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/providers/AuthProvider'

export default function Page() {
  const { user } = useAuth()

  return (
    <div className="max-w-md mx-auto flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Tài khoản</h1>
      </div>

      <Card className="m-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={
                  (typeof user?.avatar === 'object' && user?.avatar?.url) ||
                  '/account-placeholder.svg?height=80&width=80'
                }
                alt="Profile Picture"
              />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-sm text-gray-500 font-bold">{user?.email}</p>
              <div className="ml-auto">
                <div className="text-sm text-gray-500 font-bold">Roles: {user?.roles.join(', ')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
