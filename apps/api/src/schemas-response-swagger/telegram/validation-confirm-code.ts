const schemaValidationConfirmCode = {
  type: 'object',
  properties: {
    isValidConfirmCode: { type: 'boolean' },
  },
  example: {
    isValidConfirmCode: true,
  },
};

export { schemaValidationConfirmCode };
