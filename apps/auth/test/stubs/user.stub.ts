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

const profileStub = () => {
  return {
    id: 1,
    is_ban: false,
    over_user: null,
  };
};

export {
  createUserStub,
  checkUserStub,
  userDbStub,
  uniqueUserStub,
  profileStub,
};
