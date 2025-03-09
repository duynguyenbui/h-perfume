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

export type TPayloadUserLoginValidator = z.infer<typeof PayloadUserLoginValidator>
export type TPayloadUserSignUpValidator = z.infer<typeof PayloadUserSignUpValidator>
