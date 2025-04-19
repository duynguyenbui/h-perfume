import { ProductsChart } from '@/components/ProductsChart'
import { RevenueChart } from '@/components/RevenueChart'
import { CalculatorIcon } from 'lucide-react'

export default function Page() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <CalculatorIcon className="w-10 h-10 text-blue-700" />
        Thống kê
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-primary-foreground rounded-lg shadow-md p-6 h-[500px]">
          <h2 className="text-xl font-semibold mb-4">Danh số theo ngày (30 ngày gần nhất)</h2>
          <div className="h-full">
            <RevenueChart />
          </div>
        </div>

        <div className="bg-primary-foreground rounded-lg shadow-md p-6 h-[500px]">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm bán chạy nhất</h2>
          <div className="h-full">
            <ProductsChart />
          </div>
        </div>
      </div>
    </div>
  )
}
