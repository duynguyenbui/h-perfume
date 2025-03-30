'use client'

import { useState } from 'react'
import OrderDetailModal from './OrderDetailModal'
import { CalendarIcon, ChevronRightIcon } from 'lucide-react'
import { CircleDollarSign } from 'lucide-react'

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
      <div className="rounded-xl bg-white border border-gray-100 shadow-md py-12 px-4">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <p className="mt-4 text-base font-medium text-gray-500">Bạn chưa có đơn hàng nào.</p>
          <p className="mt-2 text-sm text-gray-400">
            Hãy mua sắm để bắt đầu theo dõi đơn hàng của bạn.
          </p>
        </div>
      </div>
    )
  }

  // Function to get appropriate badge styling based on shipping status
  const getStatusBadge = (status: { name: string }) => {
    if (!status) return 'bg-gray-100 text-gray-800'

    const statusName = status.name.toLowerCase()
    if (statusName.includes('đã giao') || statusName.includes('completed')) {
      return 'bg-green-100 text-green-800'
    } else if (statusName.includes('vận chuyển') || statusName.includes('shipping')) {
      return 'bg-amber-100 text-amber-800'
    } else if (statusName.includes('chờ xác nhận') || statusName.includes('pending')) {
      return 'bg-blue-100 text-blue-800'
    } else if (statusName.includes('đã hủy') || statusName.includes('cancelled')) {
      return 'bg-red-100 text-red-800'
    } else {
      return 'bg-gray-100 text-gray-800'
    }
  }

  // Format payment method names
  const formatPaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cod':
        return 'Thanh toán khi nhận hàng'
      case 'bank':
        return 'Chuyển khoản ngân hàng'
      case 'card':
        return 'Thẻ tín dụng/ghi nợ'
      case 'momo':
        return 'Ví MoMo'
      case 'zalopay':
        return 'ZaloPay'
      default:
        return method
    }
  }

  // Format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <div
          key={order.id}
          className="order-card bg-white border border-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:border-primary/20"
        >
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1 mb-4 md:mb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-start">
                <div className="flex items-center mb-2 sm:mb-0">
                  <h3 className="font-semibold text-gray-900 text-lg">Mã đơn hàng: </h3>
                  <span className="ml-2 text-primary font-bold">{order.id.substring(0, 8)}</span>
                </div>
                <div className="sm:ml-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusBadge(order.shippingStatus)}`}
                  >
                    {order.shippingStatus.name}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center text-gray-700">
                  <CircleDollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium">Tổng tiền:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {order.finalPrice.toLocaleString('vi-VN')} ₫
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium">Ngày đặt:</span>
                  <span className="ml-2 text-gray-700">{formatDate(order.createdAt)}</span>
                </div>

                {order.lineItems.length > 0 && (
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="text-sm text-gray-500 mb-1">Sản phẩm:</div>
                    <div className="flex flex-wrap gap-1">
                      {order.lineItems.map((item, index) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center bg-gray-50 rounded px-2 py-1 text-xs"
                        >
                          {item.fragrance.name}
                          {index < order.lineItems.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setSelectedOrder(order)}
                className="w-full md:w-auto px-4 py-2.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white font-medium transition flex items-center justify-center"
              >
                <span>Xem chi tiết</span>
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
