const schemaStatus = {
  type: 'object',
  properties: {
    status: { type: 'boolean' },
    message: { type: 'string' },
  },
  example: {
    status: true,
    message: 'service is running',
  },
};

export { schemaStatus };
