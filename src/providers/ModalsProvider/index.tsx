'use client'

import React, { useEffect, useState } from 'react'

export default function ModalsProvider() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <React.Fragment></React.Fragment>
}
