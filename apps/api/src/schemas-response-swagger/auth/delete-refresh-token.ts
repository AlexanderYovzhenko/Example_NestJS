const schemaDeleteRefreshToken = {
  type: 'object',
  properties: {
    isLogout: { type: 'boolean' },
  },
  example: {
    isLogout: true,
  },
};

export { schemaDeleteRefreshToken };
