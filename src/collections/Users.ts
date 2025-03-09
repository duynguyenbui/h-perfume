import { checkRole } from '@/access/checkRole'
import { admins } from '@/access/admin'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'
import { protectRoles } from '@/hooks/protectRole'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: {
      vi: 'Tài khoản',
    },
    plural: {
      vi: 'Tài khoản',
    },
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user ?? undefined),
    create: anyone,
    delete: admins,
    read: authenticated,
    update: admins,
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: {
        vi: 'Tên',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'avatar',
      label: {
        vi: 'Ảnh đại diện',
      },
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      required: true,
      hooks: {
        beforeChange: [protectRoles],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
}
