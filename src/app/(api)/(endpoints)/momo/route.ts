import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { MomoPaymentRequest, MomoPaymentResponse } from '@/types/momo'
import { createOrder } from '@/actions/orders'
import { TPayloadCheckoutValidator } from '@/validations'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { amount, checkoutData } = body

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Số tiền không hợp lệ' }, { status: 400 })
    }

    if (!checkoutData) {
      return NextResponse.json(
        { success: false, message: 'Dữ liệu đơn hàng không hợp lệ' },
        { status: 400 },
      )
    }

    // Tạo đơn hàng trong Payload CMS
    const orderResult = await createOrder(checkoutData as TPayloadCheckoutValidator)
    if (!orderResult.success || !orderResult.data) {
      return NextResponse.json({ success: false, message: orderResult.message }, { status: 400 })
    }

    const order = orderResult.data
    const orderId = order.id // Sử dụng _id từ Payload CMS

    const accessKey: string = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85'
    const secretKey: string = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    const partnerCode: string = process.env.MOMO_PARTNER_CODE || 'MOMO1'
    const orderInfo: string = `Thanh toán đơn hàng ${orderId}`
    const redirectUrl: string = `${process.env.NEXT_PUBLIC_PERMANENT_URL}/orders`
    const ipnUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/momo/callback`
    const requestType: string = 'payWithMethod'
    const extraData: string = ''
    const orderGroupId: string = ''
    const autoCapture: boolean = true
    const lang: string = 'vi'

    const requestId = `${orderId}-${Date.now()}`

    const rawSignature: string = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`
    const signature: string = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')

    const requestBody: MomoPaymentRequest = {
      partnerCode,
      partnerName: 'Đom Đóm',
      storeId: 'domdomMMMMMM',
      requestId,
      amount: amount.toString(),
      orderId, // Dùng _id
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId,
      signature,
    }

    const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(requestBody),
    })

    const result: MomoPaymentResponse = await response.json()

    if (result.resultCode === 0 && result.payUrl) {
      return NextResponse.json({ success: true, payUrl: result.payUrl })
    } else {
      return NextResponse.json(
        { success: false, message: result.message || 'Không thể tạo liên kết thanh toán' },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error('Lỗi trong API route Momo:', error)
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
