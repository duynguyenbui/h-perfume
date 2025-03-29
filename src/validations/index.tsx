import { ACCEPTED_IMAGE_TYPES } from '@/constants'
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

export const PayloadCheckoutValidator = z.object({
  lineItems: z.array(z.object({ id: z.string(), quantity: z.number() })),
  paymentMethod: z.enum(['cod', 'momo']),
  shippingAddressId: z.string(),
  shippingFeeId: z.string(),
  couponId: z.string().optional(),
})

export const PayloadMessageValidator = z.object({
  conversationId: z.string(),
  role: z.enum(['Admin', 'User']),
  content: z.string().optional(),
  attachments: z
    .array(z.instanceof(File))
    .refine(
      (files) => {
        return Array.from(files).every((file) => file instanceof File)
      },
      { message: 'Yêu cầu tệp tin' },
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes((file as File).type)),
      'Chỉ chấp nhận các định dạng .jpg, .jpeg, .png và .webp',
    )
    .refine((files) => Array.from(files).every((file) => (file as File).size < 7000000), {
      message: 'Kích thước tệp phải nhỏ hơn 7MB.',
    }),
})

export const PayloadUserSettingsValidator = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  name: z.string().min(1, {
    message: 'Tên không được để trống.',
  }),
})

export const PayloadShippingAddressValidator = z.object({
  name: z.string().min(1, {
    message: 'Tên không được để trống.',
  }),
  province: z.string().min(1, {
    message: 'Tỉnh không được để trống.',
  }),
  district: z.string().min(1, {
    message: 'Quận/Huyện không được để trống.',
  }),
  ward: z.string().min(1, {
    message: 'Phường/Xã không được để trống.',
  }),
  detailAddress: z.string().min(1, {
    message: 'Địa chỉ chi tiết không được để trống.',
  }),
  contactName: z.string().min(1, {
    message: 'Tên liên hệ không được để trống.',
  }),
  contactPhone: z.string().min(1, {
    message: 'Số điện thoại liên hệ không được để trống.',
  }),
})

export type TPayloadShippingAddressValidator = z.infer<typeof PayloadShippingAddressValidator>
export type TPayloadUserSettingsValidator = z.infer<typeof PayloadUserSettingsValidator>
export type TPayloadMessageValidator = z.infer<typeof PayloadMessageValidator>
export type TPayloadCheckoutValidator = z.infer<typeof PayloadCheckoutValidator>
export type TPayloadUserLoginValidator = z.infer<typeof PayloadUserLoginValidator>
export type TPayloadUserSignUpValidator = z.infer<typeof PayloadUserSignUpValidator>
