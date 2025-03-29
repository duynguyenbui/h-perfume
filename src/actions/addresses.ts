'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { TPayloadShippingAddressValidator, PayloadShippingAddressValidator } from '@/validations'
import { revalidatePath } from 'next/cache'

export const createShippingAddress = async (values: TPayloadShippingAddressValidator) => {
  const { user } = await getServerSideUser()

  if (!user) {
    return { success: false, message: 'Unauthorized', data: undefined }
  }

  const { data, error } = PayloadShippingAddressValidator.safeParse(values)

  if (error) {
    return { success: false, message: 'Invalid address', data: undefined }
  }

  const payload = await getPayloadClient()

  const shippingAddress = await payload.create({
    collection: 'shippingAddresses',
    data: {
      user: user,
      ...data,
    },
  })

  if (!shippingAddress) {
    return { success: false, message: 'Create address failed', data: undefined }
  }

  revalidatePath('/account')
  return { success: true, message: 'Create address successfully', data: shippingAddress }
}

export const deleteAddress = async (addressId: string) => {
  const client = await getPayloadClient()
  const { user: currentUser } = await getServerSideUser()

  if (!currentUser || !client) {
    return { success: false, message: 'Unauthorized' }
  }

  const address = await client.findByID({
    collection: 'shippingAddresses',
    id: addressId,
    depth: 1,
  })

  if (!address) {
    return { success: false, message: 'Address not found' }
  }

  if ((address.user as any).id !== currentUser.id) {
    return { success: false, message: 'Unauthorized' }
  }

  await client.delete({
    collection: 'shippingAddresses',
    id: addressId,
  })

  revalidatePath('/account')
  return { success: true, message: 'Delete address successfully' }
}

export async function getShippingAddresses() {
  const { user } = await getServerSideUser()

  if (!user) {
    return { success: false, message: 'Unauthorized', data: undefined }
  }

  const payload = await getPayloadClient()

  const { docs: addresses, totalDocs } = await payload.find({
    collection: 'shippingAddresses',
    where: {
      'user.id': {
        equals: user.id,
      },
    },
    depth: 1,
    pagination: false,
  })

  const results = totalDocs > 0 ? addresses : []

  return { success: true, message: 'Get addresses successfully', data: results || [] }
}
