import type { Access } from 'payload'
import { checkRole } from './checkRole'

export const admins: Access = ({ req }) => {
  const user = req.user || undefined

  return checkRole(['admin'], user)
}
