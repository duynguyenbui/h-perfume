import { getFragrances } from '@/actions/fragrances'
import { FragranceHoverEffect } from '@/components/FragranceHoverEffect'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const { collection = '', page = 1, limit = 10 } = await searchParams

  const pageNumber = Number(page)
  const limitNumber = Number(limit)
  const collectionName = String(collection)

  const { data: fragrances } = await getFragrances({
    page: pageNumber,
    limit: limitNumber,
    collection: collectionName,
  })

  return (
    <div className="max-w-7xl mx-auto px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nước Hoa Đẳng Cấp #{fragrances.length}</h1>
      </div>
      <FragranceHoverEffect items={fragrances} />
    </div>
  )
}
