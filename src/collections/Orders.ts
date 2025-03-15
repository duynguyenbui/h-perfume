import { CollectionConfig } from 'payload'

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
    beforeChange: [],
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
        readOnly: true,
      },
      required: true,
    },
    {
      name: 'lineItems',
      label: {
        vi: 'Sản phẩm(s)',
      },
      required: true,
      type: 'array',
      fields: [
        {
          name: 'fragrance',
          label: {
            vi: 'Sản phẩm',
          },
          type: 'relationship',
          relationTo: 'fragrances',
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
          required: true,
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
          name: 'discount',
          label: {
            vi: 'Giảm giá',
          },
          type: 'number',
          required: true,
        },
        {
          name: 'price',
          label: {
            vi: 'Giá',
          },
          required: true,
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
      },
      label: {
        vi: 'Tổng giá theo sản phẩm',
      },
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'finalPrice',
      admin: {
        position: 'sidebar',
      },
      label: {
        vi: 'Tổng giá cuối cùng',
      },
      type: 'number',
      required: true,
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
      required: true,
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
      required: true,
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
      required: true,
    },
    {
      name: 'paymentMethod',
      label: {
        vi: 'Phương thức thanh toán',
      },
      type: 'select',
      required: true,
      options: [
        {
          label: {
            vi: 'Thanh toán trực tuyến (Stripe)',
          },
          value: 'stripe',
        },
        {
          label: {
            vi: 'COD',
          },
          value: 'cod',
        },
      ],
      defaultValue: 'stripe',
    },
  ],
}
