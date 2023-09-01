import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadAccessToken } from '@app/shared/interfaces';

export const GetCurrentUser = createParamDecorator(
  (
    key: keyof JwtPayloadAccessToken,
    ctx: ExecutionContext,
  ): JwtPayloadAccessToken | Partial<JwtPayloadAccessToken> => {
    const request = ctx.switchToHttp().getRequest();

    return key ? request.user[key] : request.user;
  },
);
