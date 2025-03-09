import { HoverEffect } from '@/components/CardHoverEffect'

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Nước Hoa Đẳng Cấp
        </h1>
      </div>
      <HoverEffect items={perfumes} />
    </div>
  )
}
export const perfumes = [
  {
    title: 'Chanel No. 5',
    description: 'An iconic fragrance with a timeless blend of aldehydes, jasmine, and rose.',
    link: '/fragrances/chanel-no-5',
  },
  {
    title: 'Dior Sauvage',
    description:
      'A bold and fresh masculine fragrance with notes of bergamot, pepper, and ambroxan.',
    link: '/fragrances/dior-sauvage',
  },
  {
    title: 'Tom Ford Black Orchid',
    description:
      'A luxurious and sensual unisex fragrance featuring black truffle, ylang-ylang, and orchid.',
    link: '/fragrances/tom-ford-black-orchid',
  },
  {
    title: 'Yves Saint Laurent Libre',
    description:
      "A modern women's fragrance that balances lavender essence with Moroccan orange blossom and vanilla extract.",
    link: '/fragrances/ysl-libre',
  },
  {
    title: 'Creed Aventus',
    description:
      'A sophisticated masculine scent with top notes of pineapple, blackcurrant, apple, and bergamot.',
    link: '/fragrances/creed-aventus',
  },
  {
    title: 'Jo Malone Wood Sage & Sea Salt',
    description:
      'A fresh and natural fragrance that evokes the feeling of a breezy walk along the coast with notes of ambrette seeds, sea salt, and sage.',
    link: '/fragrances/jo-malone-wood-sage',
  },
]
