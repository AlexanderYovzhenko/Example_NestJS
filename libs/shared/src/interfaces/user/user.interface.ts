interface User {
  login: string;
  password: string;
  telegram: string;
  phone?: string;
}

interface UserWithRole extends User {
  role: string;
}

interface UserBan {
  user_id: number;
  is_ban: boolean;
}

interface OverUser {
  user_id: number;
  over_user_id: number;
}

export { User, UserWithRole, UserBan, OverUser };
