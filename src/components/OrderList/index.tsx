'use client'

import { useState } from 'react'
import OrderDetailModal from './OrderDetailModal'
import { CalendarIcon, ChevronRightIcon, Package } from 'lucide-react'
import { getPaymentStatusBadge } from '@/lib/statusUtils'

type ScentNotes = {
  topNotes: string
  middleNotes: string
  baseNotes: string
}

type Fragrance = {
  id: string
  name: string
  description: string
  price: number
  discount: number
  brand: string
  origin: string
  fragrance: string
  concentration: string
  volume: number
  scentNotes: ScentNotes
  images?: string[]
}

type LineItem = {
  id: string
  fragrance: Fragrance
  quantity: number
  price: number
  discount: number
}

type Address = {
  id: string
  name: string
  province: string
  district: string
  ward: string
  detailAddress: string
  contactName: string
  contactPhone: string
}

type Coupon = {
  id: string
  code: string
  description: string
  discountType: string
  discountAmount: number
}

type Order = {
  id: string
  createdAt: string
  updatedAt: string
  orderer: {
    id: string
    name: string
    email: string
  }
  lineItems: LineItem[]
  coupon?: Coupon
  totalPrice: number
  finalPrice: number
  shippingFee: number
  shippingStatus: {
    id: string
    name: string
    description: string
  }
  finalAddress: Address
  paymentStatus: {
    id: string
    name: string
    description: string
  }
  paymentMethod: string
}

type OrderListProps = {
  orders: Order[]
}

export default function OrderList({ orders }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (orders.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm py-12 px-6 text-center">
        <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <p className="text-lg font-medium text-gray-700">Bạn chưa có đơn hàng nào.</p>
        <p className="mt-2 text-sm text-gray-500">Hãy khám phá cửa hàng và bắt đầu mua sắm ngay!</p>
      </div>
    )
  }

  // Định dạng ngày
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const paymentStatusBadge = getPaymentStatusBadge(order.paymentStatus)
        return (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Cột thông tin chính */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${paymentStatusBadge.className}`}
                    >
                      {paymentStatusBadge.icon}
                      {paymentStatusBadge.displayName}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm">
                      <span className="font-medium">Ngày đặt:</span> {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="h-5 w-5 text-gray-400 mr-2">💵</span>
                    <span className="text-sm">
                      <span className="font-medium">Tổng tiền:</span>{' '}
                      <span className="font-semibold text-gray-900">
                        {order.finalPrice.toLocaleString('vi-VN')} ₫
                      </span>
                    </span>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                {order.lineItems.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Sản phẩm:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.lineItems.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {item.fragrance.name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Nút xem chi tiết */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="group inline-flex items-center px-4 py-2 rounded-lg bg-white border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow"
                >
                  <span>Xem chi tiết</span>
                  <ChevronRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
