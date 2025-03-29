'use client'

import { useSocket } from '@/providers/SocketProvider'
import { Badge } from '../ui/badge'

export default function SocketIndicator() {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Phục hồi: Phân giải lại mỗi 1 giây
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-emerald-500 text-white border-none">
      Trực tiếp: Cập nhật thời gian thực
    </Badge>
  )
}
