import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { uniqueUserStub, userDbStub } from '../stubs';

export const userServiceMock: Partial<ClientProxy> = {
  send: jest.fn().mockImplementation((queue, data) => {
    switch (queue.cmd) {
      case 'add_roles':
        return of(true);
      case 'add_admin':
        return data.user.login === userDbStub().login
          ? of('login_exists')
          : data.user.telegram === userDbStub().telegram
          ? of('telegram_exists')
          : data.user.phone === userDbStub().phone
          ? of('phone_exists')
          : of(userDbStub());
      case 'get_user_me':
        return data.id === userDbStub().id ? of(userDbStub()) : of(null);
      case 'get_all_users':
        return of({ count: 1, rows: [userDbStub()] });
      case 'search_users':
        return of({ count: 1, rows: [userDbStub()] });
      case 'add_user':
        return data.user.login === userDbStub().login
          ? of('login_exists')
          : data.user.telegram === userDbStub().telegram
          ? of('telegram_exists')
          : data.user.phone === userDbStub().phone
          ? of('phone_exists')
          : of({ ...uniqueUserStub(), role: 'curator' });
      case 'update_ban':
        return of(userDbStub());
      case 'update_manager':
        return data.updateUserManager.user_login === userDbStub().login
          ? of(userDbStub())
          : of(null);
      case 'update_manager':
        return data.updateUserManager.user_login === userDbStub().login
          ? of(userDbStub())
          : of(null);
      case 'update_manager':
        return data.updateUserManager.user_login === userDbStub().login
          ? of(userDbStub())
          : of(null);
      case 'update_manager':
        return data.updateUserManager.user_login === userDbStub().login
          ? of(userDbStub())
          : of(null);
      case 'update_manager':
        return data.updateUserManager.user_login === userDbStub().login
          ? of(userDbStub())
          : of(null);
      case 'delete_user':
        return data.id === userDbStub().id ? of(userDbStub()) : of(null);
      default:
        return of(userDbStub());
    }
  }),
};
