import { CollectionBeforeChangeHook, CollectionBeforeValidateHook } from 'payload'

export const shippingFeeValidateBeforeChange: CollectionBeforeValidateHook = async ({
  req,
  data,
  operation,
}) => {
  if (['create', 'update'].includes(operation)) {
    if (!data) {
      throw new Error('Data is required')
    }

    if (data.minPrice > data.maxPrice) {
      throw new Error('Min price must be less than max price')
    }

    const { minPrice, maxPrice } = data

    const { totalDocs, docs: existingFees } = await req.payload.find({
      collection: 'shippingFees',
      where: {
        or: [
          {
            and: [
              {
                minPrice: {
                  less_than_equal: minPrice,
                },
              },
              {
                maxPrice: {
                  greater_than_equal: minPrice,
                },
              },
            ],
          },
          {
            and: [
              {
                minPrice: {
                  less_than_equal: maxPrice,
                },
              },
              {
                maxPrice: {
                  greater_than_equal: maxPrice,
                },
              },
            ],
          },
          {
            and: [
              {
                minPrice: {
                  greater_than_equal: minPrice,
                },
              },
              {
                maxPrice: {
                  less_than_equal: maxPrice,
                },
              },
            ],
          },
        ],
      },
    })

    console.log(totalDocs, existingFees)

    if (totalDocs > 0) {
      throw new Error('Shipping fee already exists')
    }

    return data
  }

  throw new Error('Cannot change shipping fee')
}

export const shippingFeePopulateNameBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
}) => {
  if (['create', 'update'].includes(operation)) {
    const { minPrice, maxPrice } = data

    const name = `Từ ${minPrice}đ đến ${maxPrice}đ`

    data.name = name

    return data
  }

  throw new Error('Cannot change name of shipping fee')
}
