import { CollectionConfig } from 'payload'
import {
  orderPopulateLineItemsVersionBeforeChange,
  orderPopulateShippingFeeBeforeChange,
} from './hooks/Orders'
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: {
      vi: 'Đơn hàng',
    },
    plural: {
      vi: 'Đơn hàng',
    },
  },
  hooks: {
    beforeChange: [orderPopulateLineItemsVersionBeforeChange, orderPopulateShippingFeeBeforeChange],
  },
  fields: [
    {
      name: 'orderer',
      label: {
        vi: 'Người đặt hàng',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'lineItems',
      label: {
        vi: 'Sản phẩm(s)',
      },
      type: 'array',
      fields: [
        {
          name: 'fragrance',
          label: {
            vi: 'Sản phẩm',
          },
          type: 'relationship',
          relationTo: 'fragrances',
          admin: {
            position: 'sidebar',
          },
          required: true,
        },
        {
          name: 'versionOfFragrance',
          label: {
            vi: 'Phiên bản sản phẩm',
          },
          admin: {
            readOnly: true,
          },
          type: 'text',
        },
        {
          name: 'quantity',
          label: {
            vi: 'Số lượng',
          },
          type: 'number',
          required: true,
        },
        {
          name: 'finalPrice',
          label: {
            vi: 'Giá',
          },
          admin: {
            readOnly: true,
          },
          type: 'number',
        },
      ],
    },
    {
      name: 'coupon',
      label: {
        vi: 'Mã giảm giá',
      },
      type: 'relationship',
      relationTo: 'coupons',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'totalPrice',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: {
        vi: 'Tổng giá',
      },
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'shippingFee',
      label: {
        vi: 'Phí vận chuyển',
      },
      type: 'number',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 0,
    },
    {
      name: 'shippingStatus',
      label: {
        vi: 'Trạng thái vận chuyển',
      },
      type: 'relationship',
      relationTo: 'shippingStatuses',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'finalAddress',
      label: {
        vi: 'Địa chỉ giao hàng',
      },
      type: 'relationship',
      relationTo: 'shippingAddresses',
      hasMany: false,
      required: true,
    },
    {
      name: 'paymentStatus',
      label: {
        vi: 'Trạng thái thanh toán',
      },
      type: 'relationship',
      relationTo: 'paymentStatuses',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
