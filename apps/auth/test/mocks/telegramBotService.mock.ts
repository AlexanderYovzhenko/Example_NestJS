import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

export const telegramBotServiceMock: Partial<ClientProxy> = {
  send: jest.fn().mockImplementation((queue, data) => {
    return of(data);
  }),
};
