import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admin'

export const ShippingStatuses: CollectionConfig = {
  slug: 'shippingStatuses',
  labels: {
    singular: {
      vi: 'Trạng thái giao hàng',
    },
    plural: {
      vi: 'Trạng thái giao hàng',
    },
  },
  access: {
    create: admins,
    read: () => true,
    update: admins,
    delete: admins,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: {
        vi: 'Tên trạng thái',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: {
        vi: 'Mô tả',
      },
      type: 'textarea',
    },
  ],
}
