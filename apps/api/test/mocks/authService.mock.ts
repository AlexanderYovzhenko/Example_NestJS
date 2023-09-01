import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { refreshTokenDbStub, tokensStub, userDbStub } from '../stubs';

export const authServiceMock: Partial<ClientProxy> = {
  send: jest.fn().mockImplementation((queue, data) => {
    switch (queue.cmd) {
      case 'signup':
        return data.user.login === userDbStub().login
          ? of('login_exists')
          : data.user.telegram === userDbStub().telegram
          ? of('telegram_exists')
          : data.user.phone === userDbStub().phone
          ? of('phone_exists')
          : of(tokensStub());
      case 'login':
        return data.user.login === userDbStub().login &&
          data.user.password === userDbStub().password
          ? of(tokensStub())
          : of(null);
      case 'refresh':
        return data.refresh_token === refreshTokenDbStub().token
          ? of(tokensStub())
          : of(null);
      case 'logout':
        return of(true);
      default:
        return of(tokensStub());
    }
  }),
};
