import FragranceDetail from '@/components/FragranceDetail/page'
import React from 'react'

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}) {
  const { slug } = await params

  return <FragranceDetail fragranceId={slug} />
}
