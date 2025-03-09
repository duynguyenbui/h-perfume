/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Payload, PayloadRequest, File } from 'payload'

export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }) => {
  payload.logger.info(`Seeding demo author and user...`)

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

  await Promise.all([
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

  payload.logger.info(`Database seeded...`)
}
