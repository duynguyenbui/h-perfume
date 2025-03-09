import type { CollectionConfig } from 'payload'
import adminsAndUser from '@/access/adminAndUser'

export const ShippingAddresses: CollectionConfig = {
  slug: 'shippingAddresses',
  labels: {
    singular: {
      vi: 'Địa chỉ giao hàng',
    },
    plural: {
      vi: 'Địa chỉ giao hàng',
    },
  },
  access: {
    create: adminsAndUser,
    read: () => true,
    update: adminsAndUser,
    delete: adminsAndUser,
  },
  hooks: {
    beforeChange: [
      async ({ operation, data }) => {
        if (operation === 'create') {
          data.name = `${data.name} - ${data.user}`
        }

        if (operation === 'update') {
          const nameParts = data.name.split(' - ')
          if (nameParts.length > 1 && nameParts[1] !== data.user) {
            data.name = nameParts[0]
          }

          data.name = `${data.name} - ${data.user}`
        }

        return data
      },
    ],
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: {
        vi: 'Tên',
      },
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'province',
      label: {
        vi: 'Tỉnh/Thành phố',
      },
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'district',
      label: {
        vi: 'Quận/Huyện',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'ward',
      label: {
        vi: 'Phường/Xã',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'detailAddress',
      label: {
        vi: 'Địa chỉ chi tiết',
      },
      type: 'textarea',
      required: true,
    },
    {
      name: 'contactName',
      label: {
        vi: 'Tên liên hệ',
      },
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'contactPhone',
      label: {
        vi: 'Số điện thoại liên hệ',
      },
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'user',
      label: {
        vi: 'Người dùng',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
