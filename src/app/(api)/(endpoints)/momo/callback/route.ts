import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { MomoIPNRequest } from '@/types/momo'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Phân tích dữ liệu từ request body (dữ liệu IPN từ Momo)
    const body: MomoIPNRequest = await request.json()
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = body

    // Xác minh chữ ký để đảm bảo yêu cầu đến từ Momo
    const secretKey: string = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    const accessKey: string = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85'
    const rawSignature: string = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`
    const expectedSignature: string = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ success: false, message: 'Chữ ký không hợp lệ' }, { status: 400 })
    }

    // Trả về phản hồi thành công
    return NextResponse.json({ success: true, message: 'Xác minh thành công' })
  } catch (error) {
    console.error('Lỗi trong callback Momo:', error)
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
