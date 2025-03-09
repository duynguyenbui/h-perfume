import type { CollectionConfig } from 'payload'

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
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
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
  ],
}
