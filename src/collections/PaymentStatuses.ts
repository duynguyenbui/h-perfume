import { CollectionConfig } from 'payload'

export const PaymentStatuses: CollectionConfig = {
  slug: 'paymentStatuses',
  labels: {
    singular: {
      vi: 'Trạng thái thanh toán',
    },
    plural: {
      vi: 'Trạng thái thanh toán',
    },
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
