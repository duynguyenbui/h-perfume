import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { MomoPaymentRequest, MomoPaymentResponse } from '@/types/momo'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Phân tích dữ liệu từ request body
    const body = await request.json()
    const { amount } = body

    // Kiểm tra amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Số tiền không hợp lệ' }, { status: 400 })
    }

    // Tạo orderId và requestId (dùng timestamp để đơn giản)
    const orderId = `ORDER-${Date.now()}`
    const requestId = orderId

    // Cấu hình Momo
    const accessKey: string = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85'
    const secretKey: string = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    const partnerCode: string = process.env.MOMO_PARTNER_CODE || 'MOMO'
    const orderInfo: string = `Thanh toán đơn hàng ${orderId}`
    const redirectUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/orders` // URL để redirect sau khi thanh toán
    const ipnUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/api/momo/callback` // URL để Momo gửi callback
    const requestType: string = 'payWithMethod'
    const extraData: string = ''
    const orderGroupId: string = ''
    const autoCapture: boolean = true
    const lang: string = 'vi'

    // Tạo chữ ký (signature)
    const rawSignature: string = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`
    const signature: string = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')

    // Dữ liệu yêu cầu gửi đến Momo API
    const requestBody: MomoPaymentRequest = {
      partnerCode,
      partnerName: 'Đom Đóm',
      storeId: 'domdom',
      requestId,
      amount: amount.toString(),
      orderId,
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

    // Gọi API Momo
    const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
