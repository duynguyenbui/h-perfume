'use client'

import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useModals } from '@/stores/ModalsStore'
import { ModalType } from '@/constants'
import { useAuth } from '@/providers/AuthProvider'

export function ImageDialogModal() {
  const { user } = useAuth()
  const { isOpen, type, close, data } = useModals()

  if (!data) {
    return null
  }

  const { src, alt, title, description } = data as any

  return (
    <Dialog open={isOpen && type === ModalType.IMAGE_DIALOG && Boolean(user)} onOpenChange={close}>
      <DialogTrigger asChild />
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
        {title ? (
          <DialogHeader className="px-2">
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        ) : (
          <DialogTitle />
        )}
        <div className="relative w-full h-[75vh] overflow-hidden rounded-md">
          <Image
            src={src || '/image-dialog-placeholder.svg'}
            alt={alt}
            fill
            className="object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
