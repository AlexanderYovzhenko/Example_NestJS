export interface DecodedRefreshToken {
  user_id: number;
  token_id: string;
  iat: number;
  exp: number;
}
