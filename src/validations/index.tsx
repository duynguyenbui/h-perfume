import { z } from 'zod'

export const PayloadUserLoginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: 'Password must not be blank.',
  }),
})

export const PayloadUserSignUpValidator = z.object({
  email: z.string().email(),
  password: z.string().min(3, {
    message: 'Password must be 3 characters.',
  }),
  name: z.string().min(1, {
    message: 'First name must not be blank.',
  }),
})

// export const PayloadCheckoutValidator = z.object({
//   lineItems: z.array(
//     z.object({
//       id: z.string(),
//       quantity: z.number(),
//     }),
//   ),
//   shippingAddressId: z.string({
//     message: 'Vui lòng chọn địa chỉ giao hàng',
//   }),
//   shippingFeeId: z.string({
//     message: 'Phí vận chuyển không hợp lệ',
//   }),
//   couponId: z.string().optional(),
//   paymentMethod: z.string({
//     message: 'Vui lòng chọn phương thức thanh toán',
//   }),
//   orderId: z.string(),
// })
export const PayloadCheckoutValidator = z.object({
  lineItems: z.array(z.object({ id: z.string(), quantity: z.number() })),
  paymentMethod: z.enum(['cod', 'momo']),
  shippingAddressId: z.string(),
  shippingFeeId: z.string(),
  couponId: z.string().optional(),
})
export type TPayloadCheckoutValidator = z.infer<typeof PayloadCheckoutValidator>
export type TPayloadUserLoginValidator = z.infer<typeof PayloadUserLoginValidator>
export type TPayloadUserSignUpValidator = z.infer<typeof PayloadUserSignUpValidator>
