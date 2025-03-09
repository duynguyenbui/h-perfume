import { CollectionBeforeChangeHook } from 'payload'

export const orderPopulateLineItemsVersionBeforeChange: CollectionBeforeChangeHook = async ({
  req,
  data,
  operation,
}) => {
  if (['create'].includes(operation)) {
    const { lineItems, ...rest } = data

    const lineItemsWithVersion: any[] = []

    // populate version of fragrance
    await Promise.all(
      lineItems.map(async (lineItem: any) => {
        const { docs } = await req.payload.findVersions({
          collection: 'fragrances',
          limit: 1,
          sort: '-createdAt',
        })

        if (docs.length > 0) {
          const version = docs[0].id

          lineItemsWithVersion.push({
            ...lineItem,
            versionOfFragrance: version,
          })
        }
      }),
    )

    // populate price of version
    await Promise.all(
      lineItemsWithVersion.map(async (lineItem) => {
        const { version } = await req.payload.findVersionByID({
          collection: 'fragrances',
          id: lineItem.versionOfFragrance,
        })

        lineItem.finalPrice = version.price - ((version.discount / 100) * version.price || 0)

        return lineItem
      }),
    )

    // populate total price
    const totalPrice = lineItemsWithVersion.reduce((acc, lineItem) => {
      return acc + lineItem.finalPrice
    }, 0)

    data.lineItems = lineItemsWithVersion ?? []
    data.totalPrice = totalPrice ?? 0

    return data
  }

  if (['update'].includes(operation)) {
  }

  return null
}

export const orderPopulateShippingFeeBeforeChange: CollectionBeforeChangeHook = async ({
  req,
  data,
  operation,
}) => {
  if (['create', 'update'].includes(operation)) {
    const { totalPrice } = data

    const { totalDocs, docs: shippingFees } = await req.payload.find({
      collection: 'shippingFees',
      where: {
        and: [
          {
            minPrice: {
              less_than_equal: totalPrice,
            },
          },
          {
            maxPrice: {
              greater_than_equal: totalPrice,
            },
          },
        ],
      },
    })

    if (totalDocs > 0) {
      data.shippingFee = shippingFees[0].fee
    }

    return data
  }

  return null
}

export const orderChangeQuantityBeforeChange: CollectionBeforeChangeHook = async ({
  req,
  data,
  operation,
}) => {
  return data
}
