'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { getBestSellingProducts } from '@/actions/statistics'

export function ProductsChart() {
  const [chartData, setChartData] = useState<
    Array<{ product: string; sales: number; fill: string }>
  >([])
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    sales: {
      label: 'Số lượng bán',
    },
  })

  useEffect(() => {
    const getBestSelling = async () => {
      const products: any = await getBestSellingProducts()

      const chartColors = [
        'var(--chart-1)',
        'var(--chart-2)',
        'var(--chart-3)',
        'var(--chart-4)',
        'var(--chart-5)',
      ]

      const transformedData = products.slice(0, 5).map((item: any, index: any) => ({
        product: `product${index + 1}`,
        sales: item.sales,
        originalName: item.product,
        fill: `var(--color-product${index + 1})`, // This is important for the colors to work
      }))

      setChartData(transformedData)

      const newConfig: ChartConfig = {
        sales: {
          label: 'Số lượng bán',
        },
      }

      transformedData.forEach((item: any, index: any) => {
        const colorIndex = index + 1
        newConfig[`product${index + 1}`] = {
          label: item.originalName,
          color: chartColors[index % chartColors.length],
        }
      })

      setChartConfig(newConfig)
    }

    getBestSelling()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm bán chạy</CardTitle>
        <CardDescription>Trong tháng {new Date().getMonth() + 1}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && (
          <ChartContainer config={chartConfig} className="min-h-[300px]">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 0,
              }}
            >
              <YAxis
                dataKey="product"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  String(chartConfig[value as keyof typeof chartConfig]?.label || '')
                }
              />
              <XAxis dataKey="sales" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => [value, ' Số lượng bán']}
                  />
                }
              />
              <Bar dataKey="sales" fill="#000" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Hiển thị top 5 sản phẩm bán chạy nhất
        </div>
      </CardFooter>
    </Card>
  )
}
