const schemaCategory = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    value: { type: 'string' },
    is_news: { type: 'boolean' },
  },
  example: {
    id: 1,
    value: 'IT',
    is_news: false,
  },
};

const schemaCategories = {
  type: 'object',
  properties: {
    count: { type: 'number' },
    rows: {
      type: 'array',
      items: {
        type: 'object',
        properties: schemaCategory.properties,
      },
    },
  },
  example: {
    count: 1,
    rows: [
      {
        id: 1,
        value: 'IT',
        is_news: false,
      },
    ],
  },
};

export { schemaCategory, schemaCategories };
