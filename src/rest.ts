import type { User } from '@/payload-types'

export const rest = async (
  url: string,
  args?: any,
  options?: RequestInit,
): Promise<null | undefined | User> => {
  const method = options?.method || 'POST'

  try {
    const res = await fetch(url, {
      method,
      ...(method === 'POST' ? { body: JSON.stringify(args) } : {}),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    const { user } = await res.json()

    if (res.ok) {
      return user
    }
  } catch (e: unknown) {
    console.error(e)
  }
}
