export default {
  type: 'object',
  properties: {
    nameMarket: {type: 'string', minLength: 1},
    budget: {type: 'integer', minimum: 0},
    currency: {type: 'string', minLength: 1},
    products: {
      type: 'array',
      minItems: 1,
      maxItems: 10000,
      items: {
        type: 'object',
        properties: {
          name: {type: 'string', minLength: 1},
          approximatePrice: {type: 'number', minimum: 0},
          quantity: {type: 'integer', minimum: 1},
        },
        required: [
          'name',
          'approximatePrice',
          'quantity',
        ],
        additionalProperties: false,
      },
    },
    done: {type: 'boolean'}
  },
  required: [
    'nameMarket',
    'budget',
    'currency',
    'products',
  ],
  additionalProperties: false,
} as const;
