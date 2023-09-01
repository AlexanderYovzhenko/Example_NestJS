import {
  refreshTokenDbStub,
  refreshTokenParseStub,
  tokensStub,
} from '../stubs';
import { DecodedRefreshToken } from '@app/shared/interfaces';

export const jwtServiceMock = {
  sign(): string {
    return tokensStub().refreshToken.refresh_token;
  },
  signAsync(): string {
    return tokensStub().refreshToken.refresh_token;
  },
  verify(refresh_token: string): DecodedRefreshToken {
    return refresh_token === refreshTokenDbStub().token
      ? refreshTokenParseStub()
      : null;
  },
  decode(refresh_token: string): DecodedRefreshToken {
    return refresh_token === refreshTokenDbStub().token
      ? refreshTokenParseStub()
      : null;
  },
};
