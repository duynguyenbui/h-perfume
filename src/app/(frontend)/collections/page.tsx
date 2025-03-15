import { CollectionCarousel } from '@/components/CollectionCarousel'

export default function Page() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Bộ sưu tập nước hoa</h1>
        <p className="mt-2 text-muted-foreground">Khám phá những mùi hương độc đáo và sang trọng</p>
      </div>

      <div className="flex justify-center">
        <CollectionCarousel />
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Về bộ sưu tập của chúng tôi</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          Bộ sưu tập nước hoa cao cấp của chúng tôi mang đến những mùi hương đẳng cấp từ các thương
          hiệu nổi tiếng trên thế giới. Mỗi chai nước hoa là sự kết hợp hoàn hảo giữa nghệ thuật và
          khoa học, tạo nên những trải nghiệm mùi hương độc đáo.
        </p>
      </div>
    </div>
  )
}
