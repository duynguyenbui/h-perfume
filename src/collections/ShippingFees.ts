import { CollectionConfig } from 'payload'
import {
  shippingFeeValidateBeforeChange,
  shippingFeePopulateNameBeforeChange,
} from './hooks/ShippingFees'

export const ShippingFees: CollectionConfig = {
  slug: 'shippingFees',
  labels: {
    singular: {
      vi: 'Phí vận chuyển',
    },
    plural: {
      vi: 'Phí vận chuyển',
    },
  },
  hooks: {
    beforeValidate: [shippingFeeValidateBeforeChange],
    beforeChange: [shippingFeePopulateNameBeforeChange],
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      admin: {
        readOnly: true,
      },
      label: {
        vi: 'Giá trị đơn hàng (VND)',
      },
      type: 'text',
    },
    {
      name: 'minPrice',
      label: {
        vi: 'Giá trị tối thiểu (VND)',
      },
      type: 'number',
      required: true,
    },
    {
      name: 'maxPrice',
      label: {
        vi: 'Giá trị tối đa (VND)',
      },
      type: 'number',
      required: true,
    },
    {
      name: 'fee',
      label: {
        vi: 'Phí vận chuyển (VND)',
      },
      type: 'number',
      required: true,
      defaultValue: 0,
    },
  ],
}
