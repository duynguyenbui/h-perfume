'use client'

import { Card, CardContent } from '@/components/ui/card'
import { FrameIcon } from 'lucide-react'
import '../tailwinds.css'

export default function BeforeDashboard() {
  return (
    <Card className="w-full overflow-hidden border-0 bg-gradient-to-r from-rose-300 to-purple-400 shadow-lg">
      <CardContent className="p-0">
        <div className="p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500 opacity-20 rounded-full" />
          <div className="absolute right-20 bottom-4 w-24 h-24 bg-cyan-400 opacity-20 rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FrameIcon className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">HPerfume</h2>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Chào mừng trở lại!</h1>
              <p className="text-blue-100 max-w-md">
                Cảm ơn bạn đã quay trở lại với nền tảng HPerfume. Chúng tôi rất vui khi được nhận sự
                chỉ đạo và đồng hành cùng bạn.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
