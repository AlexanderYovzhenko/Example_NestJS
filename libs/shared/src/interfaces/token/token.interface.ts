import { Role } from '..';

interface Tokens {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
}

interface AccessToken {
  type: string;
  access_token: string;
}

interface RefreshToken {
  refresh_token: string;
}

interface JwtPayloadAccessToken {
  id: number;
  login: string;
  role: Role;
}

interface JwtPayloadRefreshToken {
  user_id: number;
  token_id: string;
}

export {
  Tokens,
  AccessToken,
  RefreshToken,
  JwtPayloadAccessToken,
  JwtPayloadRefreshToken,
};
