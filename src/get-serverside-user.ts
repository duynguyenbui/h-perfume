'use server'

import config from './payload.config'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'

export const getServerSideUser = async () => {
  const headers = await getHeaders()
  const payload = await getPayload({ config })

  const { user, permissions } = await payload.auth({ headers })

  if (user) {
    return { user, permissions }
  }

  return { user: null, permissions: [] }
}
