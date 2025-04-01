import { toast } from 'sonner'
import { createOrder } from '@/actions/orders'
import { TPayloadCheckoutValidator } from '@/validations'
import { useRouter } from 'next/navigation'

// Định nghĩa interface cho PaymentStrategy
export interface PaymentStrategy {
  processPayment(
    orderData: TPayloadCheckoutValidator,
    totalAmount: number,
    clearCart: () => void,
    router: ReturnType<typeof useRouter>,
  ): Promise<void>
}

// Strategy cho COD
export class CodPaymentStrategy implements PaymentStrategy {
  async processPayment(
    orderData: TPayloadCheckoutValidator,
    totalAmount: number,
    clearCart: () => void,
    router: ReturnType<typeof useRouter>,
  ) {
    const res = await createOrder(orderData)
    if (res.success) {
      toast.success('Đơn hàng đã được tạo thành công!')
      clearCart()
      router.push('/orders')
    } else {
      toast.error(res.message)
    }
  }
}

// Strategy cho Momo
export class MomoPaymentStrategy implements PaymentStrategy {
  async processPayment(
    orderData: TPayloadCheckoutValidator,
    totalAmount: number,
    clearCart: () => void,
    router: ReturnType<typeof useRouter>,
  ) {
    const requestBody = {
      amount: totalAmount,
      checkoutData: orderData,
    }

    const response = await fetch('/api/endpoints/momo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    const result: { success: boolean; payUrl?: string; message?: string } = await response.json()
    if (result.success && result.payUrl) {
      window.location.href = result.payUrl
    } else {
      toast.error('Không thể tạo liên kết thanh toán Momo. Vui lòng thử lại.')
    }
  }
}

// Context để quản lý Strategy
export class PaymentContext {
  private strategy: PaymentStrategy

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy
  }

  async executePayment(
    orderData: TPayloadCheckoutValidator,
    totalAmount: number,
    clearCart: () => void,
    router: ReturnType<typeof useRouter>,
  ) {
    await this.strategy.processPayment(orderData, totalAmount, clearCart, router)
  }
}
