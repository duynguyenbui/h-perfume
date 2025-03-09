import type { Access } from 'payload'
import { checkRole } from './checkRole'

const adminsOrDoctors: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    if (checkRole(['doctor'], user)) {
      return true
    }
  }

  return false
}

export default adminsOrDoctors
