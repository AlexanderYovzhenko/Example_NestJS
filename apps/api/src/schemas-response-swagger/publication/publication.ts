const schemaPublication = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    content: { type: 'json' },
    preview: { type: 'string' },
    is_hidden: { type: 'boolean' },
    category_id: { type: 'number' },
    user_id: { type: 'number' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    category: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        value: { type: 'string' },
      },
    },
    user: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        login: { type: 'string' },
      },
    },
  },
  example: {
    id: 1,
    title: 'title',
    content: '<p>publication text<p>',
    preview:
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    is_hidden: false,
    user_id: 1,
    category_id: 1,
    created_at: '2023-07-26T09:17:57.315Z',
    updated_at: '2023-07-26T09:17:57.315Z',
    category: {
      id: 1,
      value: 'it',
    },
    user: {
      id: 1,
      login: 'web',
    },
  },
};

const schemaPublications = {
  type: 'object',
  properties: {
    count: { type: 'number' },
    rows: {
      type: 'array',
      items: {
        type: 'object',
        properties: schemaPublication.properties,
      },
    },
  },
  example: {
    count: 1,
    rows: [
      {
        id: 1,
        title: 'title',
        content: '<p>publication text<p>',
        preview:
          'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
        is_hidden: false,
        user_id: 1,
        category_id: 1,
        created_at: '2023-07-26T09:17:57.315Z',
        updated_at: '2023-07-26T09:17:57.315Z',
        category: {
          id: 1,
          value: 'it',
        },
        user: {
          id: 1,
          login: 'web',
        },
      },
    ],
  },
};

export { schemaPublication, schemaPublications };
