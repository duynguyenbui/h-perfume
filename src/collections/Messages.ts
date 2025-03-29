import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: {
    singular: {
      vi: 'Tin nhắn',
    },
    plural: {
      vi: 'Tin nhắn',
    },
  },
  admin: {
    useAsTitle: 'content',
    listSearchableFields: ['content'],
  },
  fields: [
    {
      name: 'conversation',
      label: {
        vi: 'Cuộc hội thoại',
      },
      type: 'relationship',
      relationTo: 'conversations',
      required: true,
      hasMany: false,
    },
    {
      name: 'sender',
      label: {
        vi: 'Người gửi',
      },
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'role',
      label: {
        vi: 'Vai trò',
      },
      type: 'select',
      options: ['Admin', 'User'],
      required: true,
    },
    {
      name: 'content',
      label: {
        vi: 'Nội dung',
      },
      type: 'text',
    },
    {
      name: 'attachments',
      label: {
        vi: 'Tệp đính kèm',
      },
      type: 'array',
      fields: [
        {
          name: 'media',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
