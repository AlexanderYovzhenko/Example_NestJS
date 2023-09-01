const tokensStub = () => {
  return {
    accessToken: {
      type: 'Bearer',
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2b20iLCJyb2xDMsImV4NDI0NTQ4M30.ZmokrU9f2MyyAJCX_eI5-2D6Qv3uQgGDrMxHv5_G7fcQ',
    },
    refreshToken: {
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2b20iLCJyb2xDMsImV4NDI0NTQ4M30.ZmokrU9f2MyyAJCX_eI5-2D6Qv3uQgGDrMxHv5_G7fcQ',
    },
  };
};

const refreshTokenStub = () => {
  return {
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2b20iLCJyb2xDMsImV4NDI0NTQ4M30.ZmokrU9f2MyyAJCX_eI5-2D6Qv3uQgGDrMxHv5_G7fcQ',
  };
};

const refreshTokenDbStub = () => {
  return {
    id: 'eyJhbGciOiJIUzI1N',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2b20iLCJyb2xDMsImV4NDI0NTQ4M30.ZmokrU9f2MyyAJCX_eI5-2D6Qv3uQgGDrMxHv5_G7fcQ',
    exp: 1691307449,
    user_id: 1,
    info: null,
    createAt: '2023-07-07 10:37:29.26+03',
    updateAt: '2023-07-07 10:37:29.26+03',
  };
};

const refreshTokenParseStub = () => {
  return {
    user_id: 1,
    token_id: 'eyJhbGciOiJIUzI1N',
    iat: 86400000,
    exp: 86400000,
  };
};

export {
  tokensStub,
  refreshTokenStub,
  refreshTokenDbStub,
  refreshTokenParseStub,
};
