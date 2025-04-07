import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import {
  X,
  CalendarIcon,
  MapPinIcon,
  TruckIcon,
  CreditCardIcon,
  CheckCircle,
  Package,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
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

type OrderDetail = {
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

type OrderDetailModalProps = {
  order: OrderDetail
  onClose: () => void
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  // Function to get badge styling for shipping status
  const getShippingStatusBadge = (status: { name: string }) => {
    if (!status) return { className: 'bg-gray-100 text-gray-800', icon: null }

    const statusName = status.name.toLowerCase()
    if (statusName.includes('đã giao') || statusName.includes('completed')) {
      return {
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
      }
    } else if (statusName.includes('vận chuyển') || statusName.includes('shipping')) {
      return {
        className: 'bg-amber-100 text-amber-800',
        icon: <TruckIcon className="h-4 w-4 mr-1" />,
      }
    } else if (statusName.includes('chờ xác nhận') || statusName.includes('pending')) {
      return {
        className: 'bg-blue-100 text-blue-800',
        icon: <Package className="h-4 w-4 mr-1" />,
      }
    } else if (statusName.includes('đã hủy') || statusName.includes('cancelled')) {
      return {
        className: 'bg-red-100 text-red-800',
        icon: <XCircle className="h-4 w-4 mr-1" />,
      }
    }
    return {
      className: 'bg-gray-100 text-gray-800',
      icon: null,
    }
  }

  // Format payment method names
  const formatPaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cod':
        return 'Thanh toán khi nhận hàng (COD)'
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
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi })
    } catch (error) {
      return dateString
    }
  }

  // Calculate discount amounts
  const calculateCouponDiscount = () => {
    if (!order.coupon) return 0

    if (order.coupon.discountType === 'percentage') {
      return (order.totalPrice * order.coupon.discountAmount) / 100
    } else {
      return order.coupon.discountAmount
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-auto max-h-[90vh]">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold">
              Chi tiết đơn hàng #{order.id.substring(0, 8)}
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
                <span className="sr-only">Đóng</span>
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>

          <p className="mt-1 text-sm text-gray-500">Đặt ngày {formatDate(order.createdAt)}</p>

          <div className="space-y-6 mt-6">
            {/* Order status section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-wrap gap-4 justify-between">
                {/* <div className="flex items-center space-x-2">
                  <TruckIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-700 text-sm">Trạng thái vận chuyển</h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getShippingStatusBadge(order.shippingStatus).className}`}
                    >
                      {getShippingStatusBadge(order.shippingStatus).icon}
                      {order.shippingStatus.name}
                    </span>
                  </div>
                </div> */}

                <div className="flex items-center space-x-2">
                  <CreditCardIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-700 text-sm">Phương thức thanh toán</h4>
                    <p className="text-sm">{formatPaymentMethod(order.paymentMethod)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-700 text-sm">Trạng thái thanh toán</h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getPaymentStatusBadge(order.paymentStatus).className}`}
                    >
                      {getPaymentStatusBadge(order.paymentStatus).icon}
                      {getPaymentStatusBadge(order.paymentStatus).displayName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span>Sản phẩm</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({order.lineItems.length} sản phẩm)
                </span>
              </h4>
              <div className="space-y-3">
                {order.lineItems.map((item: LineItem) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-full sm:w-20 h-20 bg-gray-100 rounded overflow-hidden mb-3 sm:mb-0">
                      {/* If you have image URLs, uncomment this */}
                      {/* <img src={item.fragrance.images?.[0]} alt={item.fragrance.name} className="w-full h-full object-cover" /> */}
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                        Hình ảnh
                      </div>
                    </div>
                    <div className="sm:ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">{item.fragrance.name}</h5>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.fragrance.brand} | {item.fragrance.volume}ml{' '}
                            {item.fragrance.concentration.toUpperCase()}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <div className="flex items-center justify-end">
                            <span className="text-sm text-gray-500 mr-2">SL: {item.quantity}</span>
                            <span className="font-medium">
                              {item.price.toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                          {item.discount > 0 && (
                            <div className="text-sm text-green-600 font-medium mt-1">
                              Giảm {item.discount}%
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {item.fragrance.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div>
              <Separator className="my-4" />
              <h4 className="font-medium text-gray-900 mb-3">Thông tin thanh toán</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{order.totalPrice.toLocaleString('vi-VN')} ₫</span>
                </div>

                {order.shippingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{order.shippingFee.toLocaleString('vi-VN')} ₫</span>
                  </div>
                )}

                {order.coupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      Mã giảm giá:
                      <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                        {order.coupon.code}
                      </span>
                    </span>
                    <span className="text-green-600">
                      -{calculateCouponDiscount().toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                )}

                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-base">
                  <span>Tổng cộng:</span>
                  <span className="text-primary text-lg">
                    {order.finalPrice.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping info */}
            <div>
              <Separator className="my-4" />
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>Thông tin giao hàng</span>
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs text-gray-500 uppercase mb-1">Người nhận</h5>
                    <p className="font-medium">{order.finalAddress.contactName}</p>
                    <p className="text-sm text-gray-600">{order.finalAddress.contactPhone}</p>
                  </div>

                  <div>
                    <h5 className="text-xs text-gray-500 uppercase mb-1">Địa chỉ giao hàng</h5>
                    <p className="text-sm text-gray-600">
                      {order.finalAddress.detailAddress}, {order.finalAddress.ward},{' '}
                      {order.finalAddress.district}, {order.finalAddress.province}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
