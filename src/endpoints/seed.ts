import type { Payload, File } from 'payload'
import { faker } from '@faker-js/faker'
import path from 'path'
import fs from 'fs/promises'

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const seed = async ({ payload }: { payload: Payload }) => {
  payload.logger.info(`Deleting all data...`)

  await Promise.all([
    await payload.delete({
      collection: 'users',
      depth: 0,
      where: {
        email: {
          equals: 'demo@hperfume.com',
        },
      },
    }),
    await payload.delete({
      collection: 'users',
      depth: 0,
      where: {
        email: {
          equals: 'user@hperfume.com',
        },
      },
    }),
  ])

  Promise.all([
    payload.delete({
      collection: 'categories',
      where: {
        id: { exists: true },
      },
    }),
    payload.delete({
      collection: 'coupons',
      where: {
        id: { exists: true },
      },
    }),
    payload.delete({
      collection: 'collections',
      where: {
        id: { exists: true },
      },
    }),
    payload.delete({
      collection: 'shippingAddresses',
      where: {
        id: { exists: true },
      },
    }),
    payload.delete({
      collection: 'shippingStatuses',
      where: {
        id: { exists: true },
      },
    }),
    payload.delete({
      collection: 'shippingFees',
      where: {
        id: { exists: true },
      },
    }),
    payload.delete({
      collection: 'paymentStatuses',
      where: {
        id: { exists: true },
      },
    }),
    payload.delete({
      collection: 'orders',
      where: {
        id: { exists: true },
      },
    }),
    payload.delete({
      collection: 'fragrances',
      where: {
        id: { exists: true },
      },
    }),
    payload.delete({
      collection: 'media',
      where: {
        id: { exists: true },
      },
    }),
  ])

  const currentDate = new Date()

  payload.logger.info(`Seeding at current date: ${currentDate}`)

  payload.logger.info(`Seeding demo author and user...`)

  const [demoUser, user] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo',
        email: 'demo@hperfume.com',
        password: 'demo',
        roles: ['user'],
      },
    }),
    payload.create({
      collection: 'users',
      data: {
        name: 'User',
        email: 'user@hperfume.com',
        password: 'user',
        roles: ['user'],
      },
    }),
  ])

  payload.logger.info('Seeding shipping statuses...')

  const shippingStatuses = ['Pending', 'Shipped', 'Delivered'].map((data) => ({
    name: capitalize(data),
    description: capitalize(faker.git.commitMessage()),
  }))

  const createdShippingStatuses = await createPayloadData(
    payload,
    'shippingStatuses',
    shippingStatuses,
  )

  payload.logger.info('Seeding shipping fees...')

  const shippingFees = [
    {
      minPrice: 0,
      maxPrice: 999999,
      fee: 45000,
    },
    {
      minPrice: 1000000,
      maxPrice: 1999999,
      fee: 37500,
    },
    {
      minPrice: 2000000,
      maxPrice: 2999999,
      fee: 30000,
    },
    {
      minPrice: 3000000,
      maxPrice: 3999999,
      fee: 22500,
    },
    {
      minPrice: 4000000,
      maxPrice: 4999999,
      fee: 15000,
    },
    {
      minPrice: 5000000,
      maxPrice: 99999999999,
      fee: 0,
    },
  ]

  const createdShippingFees = await createPayloadData(payload, 'shippingFees', shippingFees)

  payload.logger.info('Seeding payment statuses...')

  const paymentStatuses = ['Pending', 'Paid'].map((data) => ({
    name: capitalize(data),
    description: capitalize(faker.git.commitMessage()),
  }))

  const createdPaymentStatuses = await createPayloadData(
    payload,
    'paymentStatuses',
    paymentStatuses,
  )

  payload.logger.info('Seeding categories...')

  const categories = [
    {
      title: 'Nước hoa nam',
      description: 'Nước hoa nam',
    },
    {
      title: 'Nước hoa nữ',
      description: 'Nước hoa nữ',
    },
    {
      title: 'Nước hoa trẻ em',
      description: 'Nước hoa trẻ em',
    },
    {
      title: 'Thanh lịch',
      description: 'Thanh lịch và tinh tế',
    },
    {
      title: 'Trẻ trung',
      description: 'Trẻ trung và tươi mới',
    },
    {
      title: 'Quý phái',
      description: 'Quý phái và thanh lịch',
    },
    {
      title: 'Trang nhã',
      description: 'Trang nhã và tinh tế',
    },
    {
      title: 'Quyến rũ',
      description: 'Quyến rũ và tinh tế',
    },
  ]

  const createdCategories = await createPayloadData(payload, 'categories', categories)

  payload.logger.info('Seeding coupons...')

  const coupons = [
    {
      description: 'Khuyến mãi tháng 3',
      minimumPriceToUse: 150000,
      quantity: 50,
      discountType: 'percentage',
      discountAmount: 10,
      effectivePeriod: {
        validFrom: faker.date.past({ years: 1 }).toISOString(),
        validTo: faker.date.future({ years: 1 }).toISOString(),
      },
    },
    {
      description: 'Ưu đãi đặc biệt cuối tuần',
      minimumPriceToUse: 300000,
      quantity: 30,
      discountType: 'fixed',
      discountAmount: 50000,
      effectivePeriod: {
        validFrom: faker.date.past({ years: 1 }).toISOString(),
        validTo: faker.date.future({ years: 1 }).toISOString(),
      },
    },
    {
      description: 'Coupon dành cho khách mới',
      minimumPriceToUse: 100000,
      quantity: 100,
      discountType: 'percentage',
      discountAmount: 15,
      effectivePeriod: {
        validFrom: faker.date.past({ years: 1 }).toISOString(),
        validTo: faker.date.future({ years: 1 }).toISOString(),
      },
    },
    {
      description: 'Khuyến mãi giữa tháng',
      minimumPriceToUse: 250000,
      quantity: 40,
      discountType: 'fixed',
      discountAmount: 30000,
      effectivePeriod: {
        validFrom: faker.date.past({ years: 1 }).toISOString(),
        validTo: faker.date.future({ years: 1 }).toISOString(),
      },
    },
    {
      description: 'Flash Sale 48 giờ',
      minimumPriceToUse: 500000,
      quantity: 10,
      discountType: 'percentage',
      discountAmount: 20,
      effectivePeriod: {
        validFrom: faker.date.past({ years: 1 }).toISOString(),
        validTo: faker.date.future({ years: 1 }).toISOString(),
      },
    },
  ]

  const createdCoupons = await createPayloadData(payload, 'coupons', coupons)

  payload.logger.info('Seeding collections...')

  const seasonNames = ['Xuân', 'Hạ', 'Thu', 'Đông']
  const specialCollections = ['Cổ điển', 'Giới hạn', 'Sang trọng', 'Hiện đại']

  const collections = [
    ...seasonNames.map((season) => ({
      name: `Bộ sưu tập mùa ${season}`,
      description: faker.commerce.productDescription().slice(0, 50),
      period: {
        from: currentDate,
        to: faker.date.future({ years: 1 }).toISOString(),
      },
    })),
    ...specialCollections.map((type) => ({
      name: `Bộ sưu tập nước hoa ${type}`,
      description: faker.commerce.productDescription().slice(0, 50),
      period: {
        from: faker.date.past({ years: 1 }).toISOString(),
        to: faker.date.future({ years: 1 }).toISOString(),
      },
    })),
  ]

  const createdCollections = await createPayloadData(payload, 'collections', collections)

  payload.logger.info('Seeding images...')

  const createdImageBuffer: any[] = []

  for (let i = 1; i <= 10; i++) {
    const imageBuffer = await readFilePayload(
      // 'D:/Projects/PayloadCMS/h-perfume/pics', // Change it depends on your local path
      'E:/project/h-perfume/pics', // Change it depends on your local path
      `${i}.jpg`,
    )

    createdImageBuffer.push(imageBuffer)
  }
  const createdImages: any[] = []

  await Promise.all(
    createdImageBuffer.map(async (imageBuffer) => {
      const createdImage = await payload.create({
        collection: 'media',
        data: {
          alt: faker.commerce.productName(),
        },
        file: imageBuffer,
      })

      createdImages.push(createdImage)

      return createdImage
    }),
  )

  payload.logger.info('Seeding addresses...')

  const addresses = [
    {
      name: 'Tran',
      province: 'Ho Chi Minh',
      district: 'Quan 1',
      ward: 'Ben Nghe',
      detailAddress: '123 Le Loi',
      contactName: 'Tran Minh Quan',
      contactPhone: '0912345678',
      user: demoUser,
    },
    {
      name: 'Le',
      province: 'Ha Noi',
      district: 'Cau Giay',
      ward: 'Dich Vong',
      detailAddress: '45 Xuan Thuy',
      contactName: 'Le Thi Thuy',
      contactPhone: '0987654321',
      user: user,
    },
  ]

  const createdAddresses = await createPayloadData(payload, 'shippingAddresses', addresses)

  payload.logger.info('Seeding orders...')

  const fragrances = [
    {
      name: 'Sauvage Eau de Parfum',
      description:
        'Nước hoa nam Dior Sauvage mạnh mẽ, nam tính với hương thơm tươi mát và cuốn hút.',
      price: 2800000,
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      discount: 10,
      quantity: 150,
      isActive: true,
      fragrance: 'Hương thơm tươi mát, cay nồng, mạnh mẽ',
      concentration: 'edc',
      volume: 100,
      brand: 'Dior',
      origin: 'Pháp',
      scentNotes: {
        topNotes: 'Bergamot, Tiêu cay',
        middleNotes: 'Hoa oải hương, Tiêu Sichuan',
        baseNotes: 'Ambroxan, Gỗ tuyết tùng, Hương Labdanum',
      },
      longevity: 'long',
      images: createdImages.slice(0, 1),
      collection: createdCollections[Math.floor(Math.random() * createdCollections.length)],
    },
    {
      name: 'Bleu de Chanel',
      description:
        'Bleu de Chanel là dòng nước hoa nam thanh lịch, mang phong cách hiện đại và quyến rũ.',
      price: 3200000,
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      discount: 5,
      quantity: 200,
      isActive: true,
      fragrance: 'Hương gỗ thơm, thanh lịch và nam tính',
      concentration: 'edp',
      volume: 100,
      brand: 'Chanel',
      origin: 'Pháp',
      scentNotes: {
        topNotes: 'Chanh vàng, Bạc hà',
        middleNotes: 'Gừng, Nhục đậu khấu',
        baseNotes: 'Hổ phách, Gỗ đàn hương',
      },
      longevity: 'medium',
      images: createdImages.slice(3, 4),
      collection: createdCollections[Math.floor(Math.random() * createdCollections.length)],
    },
    {
      name: 'Acqua di Giò Profumo',
      description:
        'Dòng nước hoa nam Giorgio Armani tươi mát, mạnh mẽ, pha trộn giữa biển cả và đất liền.',
      price: 2500000,
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      discount: 15,
      quantity: 120,
      isActive: true,
      fragrance: 'Hương biển, gỗ trầm và thảo mộc',
      concentration: 'edp',
      volume: 75,
      brand: 'Giorgio Armani',
      origin: 'Ý',
      scentNotes: {
        topNotes: 'Cam bergamot, Hương biển',
        middleNotes: 'Cây xô thơm, Hương thảo',
        baseNotes: 'Hoắc hương, Trầm hương',
      },
      longevity: 'long',
      images: createdImages.slice(1, 3),
      collection: createdCollections[Math.floor(Math.random() * createdCollections.length)],
    },
    {
      name: 'Versace Eros',
      description: 'Nước hoa nam Versace Eros đầy cuốn hút với sự kết hợp ngọt ngào và mạnh mẽ.',
      price: 2100000,
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      discount: 20,
      quantity: 180,
      isActive: true,
      fragrance: 'Hương bạc hà, vani, phương Đông',
      concentration: 'edt',
      volume: 100,
      brand: 'Versace',
      origin: 'Ý',
      scentNotes: {
        topNotes: 'Bạc hà, Táo xanh',
        middleNotes: 'Hoa phong lữ, Đậu tonka',
        baseNotes: 'Vani, Gỗ tuyết tùng',
      },
      longevity: 'long',
      images: createdImages.slice(0, 2),
      collection: createdCollections[Math.floor(Math.random() * createdCollections.length)],
    },
    {
      name: 'Le Male Jean Paul Gaultier',
      description: 'Nước hoa nam mạnh mẽ, ấm áp với hương vani và hoa oải hương đặc trưng.',
      price: 2300000,
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      discount: 15,
      quantity: 160,
      isActive: true,
      fragrance: 'Ngọt ngào, gợi cảm và cuốn hút',
      concentration: 'edt',
      volume: 125,
      brand: 'Jean Paul Gaultier',
      origin: 'Pháp',
      scentNotes: {
        topNotes: 'Bạc hà, Oải hương',
        middleNotes: 'Quế, Hoa cam',
        baseNotes: 'Vani, Hổ phách',
      },
      longevity: 'long',
      images: createdImages.slice(4, 5),
      collection: createdCollections[Math.floor(Math.random() * createdCollections.length)],
    },
  ]

  const createdFragrances = await createPayloadData(payload, 'fragrances', fragrances)

  payload.logger.info(`Database seeded...`)
}

export const createPayloadData = async (
  payload: Payload,
  collection: any,
  data: any[],
  ignoreExistingData: boolean = false,
) => {
  const createdData: any[] = []

  const { totalDocs } = await payload.find({
    collection,
    pagination: false,
  })

  if (totalDocs <= 0 || ignoreExistingData) {
    await Promise.all(
      data.map(async (item) => {
        const createdItem = await payload.create({
          collection,
          data: item,
        })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        createdData.push(createdItem)
      }),
    )

    return createdData
  }

  return createdData
}

export const readFilePayload = async (folder: string, url: string): Promise<File> => {
  const filePath = path.join(folder, url)
  const data = await fs.readFile(filePath)

  return {
    name: path.basename(filePath),
    data: Buffer.from(data),
    mimetype: `image/${path.extname(filePath).slice(1)}`,
    size: data.byteLength,
  }
}
