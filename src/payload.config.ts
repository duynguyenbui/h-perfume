// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { vi } from '@payloadcms/translations/languages/vi'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Fragrances } from './collections/Fragrances'
import { Collections } from './collections/Collections'
import { Coupons } from './collections/Coupons'
import { ShippingStatuses } from './collections/ShippingStatus'
import { ShippingAddresses } from './collections/ShippingAddresses'
import { ShippingFees } from './collections/ShippingFees'
import { PaymentStatuses } from './collections/PaymentStatuses'
import { Orders } from './collections/Orders'
import { Conversations } from './collections/Conversations'
import { Messages } from './collections/Messages'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ['./decorators/BeforeDashboard/index'],
      graphics: {
        Logo: './decorators/Logo/index',
        Icon: './decorators/Icon/index',
      },
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Fragrances,
    Collections,
    Coupons,
    ShippingStatuses,
    ShippingAddresses,
    ShippingFees,
    PaymentStatuses,
    Orders,
    Conversations,
    Messages,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  graphQL: {
    disable: true,
  },
  i18n: {
    fallbackLanguage: 'vi',
    supportedLanguages: { vi },
  },
})
