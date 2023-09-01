const createUserStub = () => {
  return {
    login: 'nickname',
    password: 'password',
    telegram: 'nickname_telegram',
    phone: '79221110500',
  };
};

const checkUserStub = () => {
  return {
    login: 'nickname',
    password: 'password',
  };
};

const userDbStub = () => {
  return {
    id: 1,
    login: 'nickname',
    password: 'password',
    telegram: 'nickname_telegram',
    phone: '79221110500',
    role_id: 1,
    createAt: '2023-07-07 10:37:29.26+03',
    updateAt: '2023-07-07 10:37:29.26+03',
  };
};

const uniqueUserStub = () => {
  return {
    login: 'uniqueLogin',
    password: 'password',
    telegram: 'uniqueTelegram',
    phone: 'uniquePhone',
  };
};

const userBanStub = () => {
  return {
    user_id: 1,
    is_ban: true,
  };
};

const overUserStub = () => {
  return {
    user_id: 1,
    over_user_id: 2,
  };
};

const userUpdateTelegramStub = () => {
  return {
    telegram: 'nickname_telegram',
  };
};

const userUpdatePhoneStub = () => {
  return {
    request_id: '1234',
    phone: '79221110500',
  };
};

const userUpdatePasswordStub = () => {
  return {
    request_id: '1234',
    password: 'password',
  };
};

const queryLimitOffsetRoleStub = () => {
  return {
    limit: 50,
    offset: 0,
    role: 'webmaster',
  };
};

const querySearchRoleStub = () => {
  return {
    search: 'nickname',
    role: 'webmaster',
  };
};

export {
  createUserStub,
  checkUserStub,
  userDbStub,
  uniqueUserStub,
  userBanStub,
  overUserStub,
  userUpdateTelegramStub,
  userUpdatePhoneStub,
  userUpdatePasswordStub,
  queryLimitOffsetRoleStub,
  querySearchRoleStub,
};
