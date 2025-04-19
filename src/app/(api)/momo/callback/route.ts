import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { MomoIPNRequest } from '@/types/momo'
import { updatePaymentStatus } from '@/actions/orders'
import { getPaymentStatus } from '@/actions/orders'

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Phân tích request body
    const body: MomoIPNRequest = await request.json()
    console.log('Dữ liệu IPN từ Momo:', JSON.stringify(body, null, 2))
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

    // Kiểm tra biến môi trường
    const secretKey = process.env.MOMO_SECRET_KEY
    const accessKey = process.env.MOMO_ACCESS_KEY
    if (!secretKey || !accessKey) {
      console.error('Thiếu MOMO_SECRET_KEY hoặc MOMO_ACCESS_KEY')
      return NextResponse.json(
        { success: false, message: 'Cấu hình server không hợp lệ' },
        { status: 500 },
      )
    }

    // Xác minh chữ ký
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.warn(
        `Chữ ký không hợp lệ cho đơn hàng ${orderId}. Nhận: ${signature}, Kỳ vọng: ${expectedSignature}`,
      )
      return NextResponse.json({ success: false, message: 'Chữ ký không hợp lệ' }, { status: 400 })
    }

    // Lấy trạng thái thanh toán từ Payload CMS
    const newPaymentStatusId =
      resultCode === 0
        ? (await getPaymentStatus('Paid'))._id
        : (await getPaymentStatus('Failed'))._id
    console.log(
      resultCode === 0
        ? `Đơn hàng ${orderId} thanh toán thành công. TransId: ${transId}`
        : `Đơn hàng ${orderId} thanh toán thất bại. ResultCode: ${resultCode}, Message: ${message}`,
    )

    // Cập nhật paymentStatus
    const updateResult = await updatePaymentStatus(orderId, newPaymentStatusId)
    if (!updateResult.success) {
      console.error(
        `Không thể cập nhật trạng thái thanh toán cho đơn hàng ${orderId}: ${updateResult.message}`,
      )
    } else {
      console.log(`Cập nhật paymentStatus của đơn hàng ${orderId} thành công`)
    }

    // Trả về phản hồi
    return NextResponse.json({
      success: true,
      message: 'Xác minh và xử lý thành công',
      orderId,
      resultCode,
    })
  } catch (error) {
    console.error(`Lỗi trong callback Momo cho đơn hàng:`, error)
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ nội bộ khi xử lý callback' },
      { status: 500 },
    )
  }
}
