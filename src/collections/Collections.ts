import { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
  slug: 'collections',
  labels: {
    singular: {
      vi: 'Bộ sưu tập',
    },
    plural: {
      vi: 'Bộ sưu tập',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'period', 'createdAt', 'updatedAt'],
    listSearchableFields: ['name', 'description'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        vi: 'Tên bộ sưu tập',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: {
        vi: 'Mô tả',
      },
    },
    {
      name: 'period',
      label: {
        vi: 'Thời gian diễn ra',
      },
      type: 'group',
      fields: [
        {
          name: 'from',
          label: {
            vi: 'Từ',
          },
          type: 'date',
          admin: {
            position: 'sidebar',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'to',
          label: {
            vi: 'Đến',
          },
          type: 'date',
          admin: {
            position: 'sidebar',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'fragrances',
      type: 'join',
      collection: 'fragrances',
      on: 'collections',
    },
  ],
}
