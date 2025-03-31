import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { MomoIPNRequest } from '@/types/momo'
import { updatePaymentStatus } from '@/actions/orders'

// Định nghĩa các _id của trạng thái thanh toán từ collection paymentStatus
const PAYMENT_STATUS_IDS = {
  PENDING: '67d83c2d5474115f08276b48', // "Pending"
  PAID: '67d83c2d5474115f08276b49', // "Paid"
  FAILED: '67d83c2d5474115f08276b4a', // "Failed" (giả định, thay bằng _id thực tế nếu có)
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Phân tích dữ liệu từ request body (IPN từ Momo)
    const body: MomoIPNRequest = await request.json()
    console.log('📥 Dữ liệu IPN từ Momo:', JSON.stringify(body, null, 2))
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

    // Lấy secretKey và accessKey từ biến môi trường
    const secretKey = process.env.MOMO_SECRET_KEY
    const accessKey = process.env.MOMO_ACCESS_KEY

    // Kiểm tra biến môi trường
    if (!secretKey || !accessKey) {
      console.error('Thiếu MOMO_SECRET_KEY hoặc MOMO_ACCESS_KEY trong biến môi trường')
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

    // Xử lý kết quả thanh toán
    let newPaymentStatusId: string
    if (resultCode === 0) {
      newPaymentStatusId = PAYMENT_STATUS_IDS.PAID // "Paid"
      console.log(`Đơn hàng ${orderId} thanh toán thành công qua Momo. TransId: ${transId}`)
    } else {
      newPaymentStatusId = PAYMENT_STATUS_IDS.FAILED // "Failed"
      console.log(
        `Đơn hàng ${orderId} thanh toán thất bại. ResultCode: ${resultCode}, Message: ${message}`,
      )
    }

    // Cập nhật paymentStatus trong document orders
    const updateResult = await updatePaymentStatus(orderId, newPaymentStatusId)
    if (!updateResult.success) {
      console.error(
        `Không thể cập nhật trạng thái thanh toán cho đơn hàng ${orderId}: ${updateResult.message}`,
      )
    } else {
      console.log(
        `Cập nhật paymentStatus của đơn hàng ${orderId} thành ${newPaymentStatusId} thành công`,
      )
    }

    // Trả về phản hồi cho Momo
    return NextResponse.json({
      success: true,
      message: 'Xác minh và xử lý thành công',
      orderId,
      resultCode,
    })
  } catch (error) {
    console.error(`Lỗi trong callback Momo cho đơn hàng`, error)
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ nội bộ khi xử lý callback' },
      { status: 500 },
    )
  }
}
