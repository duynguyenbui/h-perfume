import { NextResponse } from 'next/server'
import crypto from 'crypto'
import payload from 'payload'
import { MomoIPNRequest } from '@/types/momo'
import { Order } from '@/payload-types'

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

    // Tìm đơn hàng trong Payload CMS
    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: { orderId: { equals: orderId } },
      limit: 1,
      depth: 0,
    })

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy đơn hàng' },
        { status: 404 },
      )
    }

    const order: Order = orders[0]

    // Tìm paymentStatus dựa trên resultCode
    const paymentStatusValue: 'completed' | 'failed' = resultCode === 0 ? 'completed' : 'failed'
    const { docs: paymentStatuses } = await payload.find({
      collection: 'paymentStatuses',
      where: { value: { equals: paymentStatusValue } },
      limit: 1,
      depth: 0,
      pagination: false,
    })

    if (!paymentStatuses || paymentStatuses.length === 0) {
      return NextResponse.json(
        { success: false, message: `Trạng thái thanh toán '${paymentStatusValue}' không tồn tại` },
        { status: 400 },
      )
    }

    const paymentStatusId = paymentStatuses[0].id

    // Tìm shippingStatus dựa trên resultCode
    const shippingStatusValue: 'processing' | 'cancelled' =
      resultCode === 0 ? 'processing' : 'cancelled'
    const { docs: shippingStatuses } = await payload.find({
      collection: 'shippingStatuses',
      where: { value: { equals: shippingStatusValue } },
      limit: 1,
      depth: 0,
      pagination: false,
    })

    if (!shippingStatuses || shippingStatuses.length === 0) {
      return NextResponse.json(
        { success: false, message: `Trạng thái giao hàng '${shippingStatusValue}' không tồn tại` },
        { status: 400 },
      )
    }

    const shippingStatusId = shippingStatuses[0].id

    // Cập nhật trạng thái đơn hàng
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        paymentStatus: paymentStatusId,
        shippingStatus: shippingStatusId, // Sửa từ orderStatus thành shippingStatus
      },
    })

    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái thành công' })
  } catch (error) {
    console.error('Lỗi trong callback Momo:', error)
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
