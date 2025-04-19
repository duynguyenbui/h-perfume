'use client'

import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useEffect, useState } from 'react'
import { getRevenueInMonth } from '@/actions/statistics'

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function RevenueChart() {
  const [revenueByDay, setRevenueByDay] = useState<any>()
  const [totalRevenue, setTotalRevenue] = useState<number>(0)

  useEffect(() => {
    getRevenueInMonth().then((res) => {
      setRevenueByDay(res.dailyRevenue)
      setTotalRevenue(res.totalRevenue)
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh số trong 30 ngày</CardTitle>
        <CardDescription>Tháng {new Date().getMonth() + 1}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={revenueByDay}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-desktop)',
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <div className="leading-none text-muted-foreground">
            Tổng doanh thu: {totalRevenue.toLocaleString()} đ
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
