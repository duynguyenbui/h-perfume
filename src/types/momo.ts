// Định nghĩa type cho request body gửi đến Momo
export interface MomoPaymentRequest {
  partnerCode: string
  partnerName: string
  storeId: string
  requestId: string
  amount: string
  orderId: string
  orderInfo: string
  redirectUrl: string
  ipnUrl: string
  lang: string
  requestType: string
  autoCapture: boolean
  extraData: string
  orderGroupId: string
  signature: string
}

// Định nghĩa type cho response từ Momo
export interface MomoPaymentResponse {
  partnerCode: string
  orderId: string
  requestId: string
  amount: number
  resultCode: number
  message: string
  payUrl?: string
}

// Định nghĩa type cho IPN request từ Momo
export interface MomoIPNRequest {
  partnerCode: string
  orderId: string
  requestId: string
  amount: number
  orderInfo: string
  orderType: string
  transId: number
  resultCode: number
  message: string
  payType: string
  responseTime: string
  extraData: string
  signature: string
}

// Định nghĩa type cho request body gửi đến API route /api/momo
export interface CreateMomoPaymentRequest {
  amount: number
  orderId: string
  returnUrl: string
  userId: string
  lineItems: Array<{
    id: string
    quantity: number
    price: number
    discount?: number
    versionOfFragrance?: string
  }>
  shippingAddressId: string
  shippingFeeId: string
  couponId?: string
  paymentMethod: 'momo' // Chỉ chấp nhận "momo"
}
