import { CollectionConfig } from 'payload'

export const Fragrances: CollectionConfig = {
  slug: 'fragrances',
  labels: {
    singular: {
      vi: 'Nước hoa',
    },
    plural: {
      vi: 'Nước hoa',
    },
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: {
        vi: 'Tên sản phẩm',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        vi: 'Mô tả',
      },
    },
    {
      name: 'price',
      label: {
        vi: 'Giá',
      },
      min: 0,
      max: 1000,
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      label: {
        vi: 'Danh mục',
      },
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'discount',
      label: {
        vi: 'Giảm giá (%)',
      },
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
      required: true,
    },
    {
      name: 'images',
      label: {
        vi: 'Ảnh',
      },
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'quantity',
      label: {
        vi: 'Số lượng',
      },
      admin: {
        position: 'sidebar',
      },
      type: 'number',
      required: true,
      min: 0,
      max: 1000,
    },
    {
      name: 'isActive',
      label: {
        vi: 'Trạng thái',
      },
      admin: {
        position: 'sidebar',
      },
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    {
      name: 'fragrance',
      label: {
        vi: 'Hương thơm',
      },
      admin: {
        position: 'sidebar',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'concentration',
      label: {
        vi: 'Nồng độ tinh dầu',
      },
      required: true,
      type: 'select',
      options: [
        {
          label: 'Eau de Cologne (EDC)',
          value: 'edc',
        },
        {
          label: 'Eau de Toilette (EDT)',
          value: 'edt',
        },
        {
          label: 'Eau de Parfum (EDP)',
          value: 'edp',
        },
        {
          label: 'Parfum/Extrait',
          value: 'parfum',
        },
      ],
    },
    {
      name: 'volume',
      label: {
        vi: 'Dung tích (ml)',
      },
      required: true,
      type: 'number',
      min: 0,
    },
    {
      name: 'brand',
      label: {
        vi: 'Thương hiệu',
      },
      required: true,
      type: 'text',
    },
    {
      name: 'origin',
      label: {
        vi: 'Xuất xứ',
      },
      required: true,
      type: 'text',
    },
    {
      name: 'scentNotes',
      label: {
        vi: 'Nốt hương',
      },
      admin: {
        position: 'sidebar',
      },
      type: 'group',
      fields: [
        {
          name: 'topNotes',
          required: true,
          label: {
            vi: 'Hương đầu',
          },
          type: 'text',
        },
        {
          name: 'middleNotes',
          required: true,
          label: {
            vi: 'Hương giữa',
          },
          type: 'text',
        },
        {
          name: 'baseNotes',
          required: true,
          label: {
            vi: 'Hương cuối',
          },
          type: 'text',
        },
      ],
    },
    {
      name: 'longevity',
      label: {
        vi: 'Độ lưu hương',
      },
      required: true,
      type: 'select',
      options: [
        {
          label: 'Ngắn (2-4 giờ)',
          value: 'short',
        },
        {
          label: 'Trung bình (4-6 giờ)',
          value: 'medium',
        },
        {
          label: 'Dài (6-8 giờ)',
          value: 'long',
        },
        {
          label: 'Rất dài (>8 giờ)',
          value: 'very_long',
        },
      ],
    },
    {
      name: 'collections',
      type: 'relationship',
      relationTo: 'collections',
      admin: {
        position: 'sidebar',
      },
      hasMany: false,
    },
  ],
}
