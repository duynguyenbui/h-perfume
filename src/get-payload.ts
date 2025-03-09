import { getPayload, Payload } from 'payload'
import config from './payload.config'

let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = {
    client: null,
  }
}

export const getPayloadClient = async (): Promise<Payload> => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = await getPayload({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e
  }

  return cached.client
}
