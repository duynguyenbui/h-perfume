import type { User } from '@/payload-types'

export const checkRole = (
  allRoles: User['roles'] = [],
  user: User | undefined = undefined,
): boolean => {
  if (user) {
    if (
      allRoles?.some((role) => {
        return user.roles?.some((individualRole) => {
          return individualRole === role
        })
      })
    ) {
      return Boolean(true)
    }
  }
  return Boolean(false)
}
