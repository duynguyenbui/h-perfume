import { NextResponse } from 'next/server'
import crypto from 'crypto'
import payload from 'payload'
import { MomoPaymentRequest, MomoPaymentResponse, CreateMomoPaymentRequest } from '@/types/momo'
import { Order } from '@/payload-types'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log('Bước 1: Đang phân tích body của request...')
    // Phân tích dữ liệu từ request body
    const body: CreateMomoPaymentRequest = await request.json()
    const {
      amount,
      orderId,
      returnUrl,
      userId,
      lineItems,
      shippingAddressId,
      shippingFeeId,
      couponId,
      paymentMethod,
    } = body
    console.log('Bước 2: Kiểm tra paymentMethod...')
    // Kiểm tra paymentMethod
    if (paymentMethod !== 'momo') {
      return NextResponse.json(
        { success: false, message: 'Phương thức thanh toán không hợp lệ. Chỉ hỗ trợ Momo.' },
        { status: 400 },
      )
    }

    // Tìm `paymentStatus` có giá trị "pending"
    console.log('Bước 3: Tìm paymentStatus với value: "pending"...')
    const paymentStatuses = await payload.find({
      collection: 'paymentStatuses',
      where: { value: { equals: 'pending' } },
    })
    console.log('Kết quả tìm paymentStatuses:', paymentStatuses)
    if (!paymentStatuses.docs || paymentStatuses.docs.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy trạng thái thanh toán 'pending'" },
        { status: 400 },
      )
    }

    const pendingPaymentStatusId = paymentStatuses.docs[0].id
    console.log('Bước 4: Tìm shippingStatus với value: "pending"...')
    // Tìm `shippingStatus` có giá trị "pending"
    const shippingStatuses = await payload.find({
      collection: 'shippingStatuses',
      where: { value: { equals: 'pending' } },
    })

    if (!shippingStatuses.docs || shippingStatuses.docs.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy trạng thái vận chuyển 'pending'" },
        { status: 400 },
      )
    }

    const pendingShippingStatusId = shippingStatuses.docs[0].id
    console.log('Bước 5: Tính phí vận chuyển...')
    // Tính phí vận chuyển (nếu có logic để lấy từ shippingFeeId)
    const shippingFee = 0 // Cần thay bằng logic thực tế nếu có (ví dụ: lấy từ collection `shippingFees`)
    console.log('Bước 6: Tạo đơn hàng trong Payload CMS...')
    // Tạo đơn hàng trong Payload CMS
    const order = (await payload.create({
      collection: 'orders' as const,
      data: {
        orderId,
        orderer: userId,
        lineItems: lineItems.map((item) => ({
          fragrance: item.id,
          versionOfFragrance: item.versionOfFragrance || 'default',
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
        })),
        coupon: couponId || null,
        totalPrice: lineItems.reduce(
          (acc, item) =>
            acc + (item.price - (item.price * (item.discount || 0)) / 100) * item.quantity,
          0,
        ),
        finalPrice: amount, // Tổng giá cuối cùng (bao gồm phí vận chuyển và giảm giá)
        shippingFee,
        shippingStatus: pendingShippingStatusId,
        finalAddress: shippingAddressId,
        paymentStatus: pendingPaymentStatusId,
        paymentMethod: 'momo', // Gán cứng vì đây là API route cho Momo
      },
    })) as Order

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Không thể tạo đơn hàng' },
        { status: 400 },
      )
    }
    console.log('Bước 7: Cấu hình Momo...')
    // Cấu hình Momo
    const accessKey: string = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85'
    const secretKey: string = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    const orderInfo: string = `Thanh toán đơn hàng ${orderId}`
    const partnerCode: string = process.env.MOMO_PARTNER_CODE || 'MOMO'
    const redirectUrl: string = returnUrl
    const ipnUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/api/momo/callback`
    const requestType: string = 'payWithMethod'
    const requestId: string = orderId
    const extraData: string = ''
    const orderGroupId: string = ''
    const autoCapture: boolean = true
    const lang: string = 'vi'
    console.log('Bước 8: Tạo chữ ký cho Momo...')
    // Tạo chữ ký (signature)
    const rawSignature: string = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`
    const signature: string = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')
    console.log('signature:', signature)
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
      // Nếu tạo thanh toán Momo thất bại, cập nhật trạng thái đơn hàng
      const failedPaymentStatuses = await payload.find({
        collection: 'paymentStatuses',
        where: { value: { equals: 'failed' } },
      })

      if (!failedPaymentStatuses.docs || failedPaymentStatuses.docs.length === 0) {
        return NextResponse.json(
          { success: false, message: "Không tìm thấy trạng thái thanh toán 'failed'" },
          { status: 400 },
        )
      }

      const failedPaymentStatusId = failedPaymentStatuses.docs[0].id

      const cancelledShippingStatuses = await payload.find({
        collection: 'shippingStatuses',
        where: { value: { equals: 'cancelled' } },
      })

      if (!cancelledShippingStatuses.docs || cancelledShippingStatuses.docs.length === 0) {
        return NextResponse.json(
          { success: false, message: "Không tìm thấy trạng thái vận chuyển 'cancelled'" },
          { status: 400 },
        )
      }

      const cancelledShippingStatusId = cancelledShippingStatuses.docs[0].id

      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          paymentStatus: failedPaymentStatusId,
          shippingStatus: cancelledShippingStatusId,
        },
      })

      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error('Lỗi trong API route Momo:', error)
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
