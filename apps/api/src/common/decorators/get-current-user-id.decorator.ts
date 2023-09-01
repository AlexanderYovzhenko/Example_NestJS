import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadAccessToken } from '@app/shared/interfaces';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayloadAccessToken;

    return user.id;
  },
);
