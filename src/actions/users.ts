'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { PayloadUserSettingsValidator, TPayloadUserSettingsValidator } from '@/validations'
import { revalidatePath } from 'next/cache'

export const updateUser = async (values: TPayloadUserSettingsValidator) => {
  const { data, error } = await PayloadUserSettingsValidator.safeParseAsync(values)

  if (!data || error) {
    return { success: false, message: error.message }
  }

  const { email, name, password } = data

  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) {
    return { success: false, message: 'Unauthorized' }
  }

  const payload = await getPayloadClient()

  const user = payload.findByID({
    collection: 'users',
    id: currentUser.id,
  })

  if (!user || currentUser.email !== email) {
    return { success: false, message: 'Unauthorized' }
  }

  const updatedUser = await payload.update({
    collection: 'users',
    id: currentUser.id,
    data: {
      name,
      email,
      ...(password && password.length > 0 && { password }),
    },
  })

  if (updatedUser) {
    revalidatePath('/account')
    return { success: true, message: 'Updated user' }
  } else {
    return { success: false, message: 'Failed to update user' }
  }
}
