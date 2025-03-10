import { CollectionBeforeChangeHook } from 'payload'

export const orderPopulateLineItemsVersionBeforeChange: CollectionBeforeChangeHook = async ({
  req,
  data,
  originalDoc,
  operation,
}) => {
  const { lineItems } = data
  const { lineItems: originalLineItems } = originalDoc

  let isUpdated: boolean = false

  if (['create'].includes(operation)) {
    isUpdated = true
  }

  if (['update'].includes(operation)) {
    if (lineItems.length !== originalLineItems.length) {
      isUpdated = true
    }

    for (let i = 0; i < lineItems.length && !isUpdated; i++) {
      if (
        lineItems[i].fragrance !== originalLineItems[i].fragrance ||
        lineItems[i].quantity !== originalLineItems[i].quantity
      ) {
        isUpdated = true
      }
    }
  }

  if (isUpdated) {
    const { lineItems } = data

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

    // populate quatity of fragrance
    await Promise.all(
      lineItemsWithVersion.map(async (lineItem) => {
        const { docs } = await req.payload.find({
          collection: 'fragrances',
          where: {
            id: {
              equals: lineItem.fragrance,
            },
          },
        })

        if (lineItem.quantity > docs[0].quantity) {
          lineItem.quantity = docs[0].quantity
        }

        return lineItem
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
      return acc + lineItem.finalPrice * lineItem.quantity
    }, 0)

    data.lineItems = lineItemsWithVersion ?? []
    data.totalPrice = totalPrice ?? 0

    return data
  }

  if (!data.totalPrice || data.totalPrice === 0) {
    return null
  }

  return data
}

export const orderPopulateShippingFeeBeforeChange: CollectionBeforeChangeHook = async ({
  req,
  data,
  operation,
}) => {
  if (['create'].includes(operation)) {
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

  return data
}
