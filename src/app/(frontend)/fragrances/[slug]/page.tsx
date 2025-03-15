import FragranceDetail from '@/components/FragranceDetail/page'
import React from 'react'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const { slug } = await params

  return <FragranceDetail fragranceId={slug} />
}
