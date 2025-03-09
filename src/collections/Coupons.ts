import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidatePath } from 'next/cache'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: {
    singular: {
      vi: 'Mã giảm giá',
    },
    plural: {
      vi: 'Mã giảm giá',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'code',
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/coupons')
      },
    ],
  },
  fields: [
    {
      name: 'code',
      label: {
        vi: 'Mã giảm giá',
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
    {
      name: 'minimumPriceToUse',
      label: {
        vi: 'Số tiền tối thiểu để sử dụng',
      },
      type: 'number',
      required: true,
    },
    {
      name: 'currentUse',
      label: {
        vi: 'Số người đã sử dụng',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'quantity',
      type: 'number',
      label: {
        vi: 'Số lượng',
      },
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'discountType',
      label: {
        vi: 'Loại giảm giá',
      },
      type: 'select',
      options: [
        {
          label: {
            vi: 'Phần trăm',
          },
          value: 'percentage',
        },
        {
          label: {
            vi: 'Số tiền cố định',
          },
          value: 'fixed',
        },
      ],
      required: true,
    },
    {
      name: 'discountAmount',
      label: {
        vi: 'Số tiền giảm',
      },
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'collectedUsers',
      label: {
        vi: 'Người dùng đã thu thập',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'effectivePeriod',
      label: {
        vi: 'Thời gian hiệu lực',
      },
      admin: {
        position: 'sidebar',
      },
      type: 'group',
      fields: [
        {
          name: 'validFrom',
          label: {
            vi: 'Từ',
          },
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'MMMM d, yyyy, h:mm a',
            },
          },
        },
        {
          name: 'validTo',
          label: {
            vi: 'Đến',
          },
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'MMMM d, yyyy, h:mm a',
            },
          },
        },
      ],
    },
  ],
}
