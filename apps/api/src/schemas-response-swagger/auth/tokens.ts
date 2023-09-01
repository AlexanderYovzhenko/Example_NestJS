const schemaTokens = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    access_token: { type: 'string' },
    refresh_token: { type: 'string' },
  },
  example: {
    type: 'Bearer',
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwibG9naW4iOiJuaWNrbmFtZSIsImlhdCI6MTY4ODUzODA5OSwiZXhwIjoxNjg4NTM5ODk5fQ.1bKzIyaXArJf_-IxKiwQD4JVX5XX2GEayz5RsVJ7eM8',
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwibG9naW4iOiJuaWNrbmFtZSIsImlhdCI6MTY4ODUzODA5OSwiZXhwIjoxNjg4NTM5ODk5fQ.1bKzIyaXArJf_-IxKiwQD4JVX5XX2GEayz5RsVJ7eM8',
  },
};

export { schemaTokens };
