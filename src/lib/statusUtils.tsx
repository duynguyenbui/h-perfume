import { CheckCircle, Package, XCircle } from 'lucide-react'

export const getPaymentStatusBadge = (status: { name: string } | undefined) => {
  if (!status) return { className: 'bg-gray-100 text-gray-800', icon: null, displayName: 'Không xác định' }

  const statusName = status.name.toLowerCase()
  if (statusName === 'paid') {
    return {
      className: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
      displayName: 'Thanh toán thành công',
    }
  } else if (statusName === 'pending') {
    return {
      className: 'bg-blue-100 text-blue-800',
      icon: <Package className="h-4 w-4 mr-1" />,
      displayName: 'Chờ thanh toán',
    }
  } else if (statusName === 'failed' || statusName.includes('cancelled')) {
    return {
      className: 'bg-red-100 text-red-800',
      icon: <XCircle className="h-4 w-4 mr-1" />,
      displayName: 'Thanh toán thất bại',
    }
  }
  return {
    className: 'bg-gray-100 text-gray-800',
    icon: null,
    displayName: status.name,
  }
}