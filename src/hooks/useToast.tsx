'use client'

import { useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

export default function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type })

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  const ToastComponent = () => {
    if (!toast) return null

    return (
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-white
        ${toast.type === 'success' ? 'bg-green-500' : ''}
        ${toast.type === 'error' ? 'bg-red-500' : ''}
        ${toast.type === 'info' ? 'bg-blue-500' : ''}
        `}
      >
        {toast.message}
      </div>
    )
  }

  return { showToast, ToastComponent }
}
