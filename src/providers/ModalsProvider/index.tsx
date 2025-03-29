'use client'

import React, { useEffect, useState } from 'react'
import { ImageDialogModal } from '@/components/Modals/ImageModal'
import { AddressModal } from '@/components/Modals/AddressModal'

export default function ModalsProvider() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <React.Fragment>
      <ImageDialogModal />
      <AddressModal />
    </React.Fragment>
  )
}
