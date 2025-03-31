'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OrderList from '@/components/OrderList'
import { getUserOrders } from '@/actions/orders'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Package, Search, ShoppingBag, Filter, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      const result = await getUserOrders()
      setLoading(false)

      if (result.success) {
        setOrders(result.orders)
      } else {
        router.push('/login')
      }
    }

    fetchOrders()
  }, [router])

  const filteredOrders = orders
    .filter((order) => {
      if (filterStatus !== 'all' && order.status !== filterStatus) {
        return false
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          order.id.toLowerCase().includes(searchLower) ||
          order.items.some((item: any) => item.name.toLowerCase().includes(searchLower))
        )
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === 'price-high') {
        return b.totalAmount - a.totalAmount
      } else if (sortBy === 'price-low') {
        return a.totalAmount - b.totalAmount
      }
      return 0
    })

  const pendingOrders = orders.filter((order) => order.status === 'pending')
  const processingOrders = orders.filter((order) => order.status === 'processing')
  const shippedOrders = orders.filter((order) => order.status === 'shipped')
  const deliveredOrders = orders.filter((order) => order.status === 'delivered')
  const cancelledOrders = orders.filter((order) => order.status === 'cancelled')

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Đang tải đơn hàng của bạn...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary/90 to-primary/70 dark:from-primary/80 dark:to-primary/60">
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="inline-block mr-2">📦</span>
                Đơn Hàng Của Bạn
              </h1>
              <p className="text-white/90 text-lg max-w-md">
                Theo dõi và quản lý tất cả đơn hàng của bạn tại một nơi
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <OrderStatCard
                icon={<Package className="h-6 w-6 text-white" />}
                count={orders.length}
                label="Tổng đơn hàng"
              />
              <OrderStatCard
                icon={<Clock className="h-6 w-6 text-white" />}
                count={pendingOrders.length + processingOrders.length}
                label="Đang xử lý"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {orders.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          <>
            {/* Search and Filter */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm đơn hàng..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-40">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Sắp xếp</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Mới nhất</SelectItem>
                          <SelectItem value="oldest">Cũ nhất</SelectItem>
                          <SelectItem value="price-high">Giá cao → thấp</SelectItem>
                          <SelectItem value="price-low">Giá thấp → cao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-40">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Trạng thái</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="pending">Chờ xác nhận</SelectItem>
                          <SelectItem value="processing">Đang xử lý</SelectItem>
                          <SelectItem value="shipped">Đang giao</SelectItem>
                          <SelectItem value="delivered">Đã giao</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
                <TabsTrigger value="all" className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Tất cả</span>
                  <Badge variant="secondary" className="ml-1">
                    {orders.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-1">
                  <span>Chờ xác nhận</span>
                  <Badge variant="secondary" className="ml-1">
                    {pendingOrders.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="processing" className="flex items-center gap-1">
                  <span>Đang xử lý</span>
                  <Badge variant="secondary" className="ml-1">
                    {processingOrders.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="shipped" className="flex items-center gap-1">
                  <span>Đang giao</span>
                  <Badge variant="secondary" className="ml-1">
                    {shippedOrders.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="delivered" className="flex items-center gap-1">
                  <span>Đã giao</span>
                  <Badge variant="secondary" className="ml-1">
                    {deliveredOrders.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="flex items-center gap-1">
                  <span>Đã hủy</span>
                  <Badge variant="secondary" className="ml-1">
                    {cancelledOrders.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {filteredOrders.length === 0 ? (
                  <NoResultsFound searchTerm={searchTerm} />
                ) : (
                  <motion.div variants={container} initial="hidden" animate="show">
                    <OrderList orders={filteredOrders} />
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="pending">
                <OrderList
                  orders={pendingOrders.filter((order) =>
                    searchTerm ? order.id.toLowerCase().includes(searchTerm.toLowerCase()) : true,
                  )}
                />
              </TabsContent>

              <TabsContent value="processing">
                <OrderList
                  orders={processingOrders.filter((order) =>
                    searchTerm ? order.id.toLowerCase().includes(searchTerm.toLowerCase()) : true,
                  )}
                />
              </TabsContent>

              <TabsContent value="shipped">
                <OrderList
                  orders={shippedOrders.filter((order) =>
                    searchTerm ? order.id.toLowerCase().includes(searchTerm.toLowerCase()) : true,
                  )}
                />
              </TabsContent>

              <TabsContent value="delivered">
                <OrderList
                  orders={deliveredOrders.filter((order) =>
                    searchTerm ? order.id.toLowerCase().includes(searchTerm.toLowerCase()) : true,
                  )}
                />
              </TabsContent>

              <TabsContent value="cancelled">
                <OrderList
                  orders={cancelledOrders.filter((order) =>
                    searchTerm ? order.id.toLowerCase().includes(searchTerm.toLowerCase()) : true,
                  )}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}

function OrderStatCard({
  icon,
  count,
  label,
}: {
  icon: React.ReactNode
  count: number
  label: string
}) {
  return (
    <div className="bg-white/10 rounded-lg p-4 min-w-[140px]">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold text-white">{count}</p>
          <p className="text-sm text-white/80">{label}</p>
        </div>
      </div>
    </div>
  )
}

function EmptyOrdersState() {
  const router = useRouter()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <ShoppingBag className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Chưa có đơn hàng nào</CardTitle>
        <CardDescription>
          Bạn chưa có đơn hàng nào. Hãy mua sắm và quay lại đây để theo dõi đơn hàng của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <Button onClick={() => router.push('/products')}>Mua sắm ngay</Button>
      </CardContent>
    </Card>
  )
}

function NoResultsFound({ searchTerm }: { searchTerm: string }) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Không tìm thấy kết quả</h3>
        {searchTerm ? (
          <p className="text-muted-foreground text-center">
            Không tìm thấy đơn hàng nào phù hợp với
          </p>
        ) : (
          <p className="text-muted-foreground text-center">
            Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại
          </p>
        )}
      </CardContent>
    </Card>
  )
}
