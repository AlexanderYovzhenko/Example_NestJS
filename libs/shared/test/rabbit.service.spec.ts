import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { RabbitService } from '../src/services';
import { mockChannel, mockMessage, mockRmqContext } from './mocks';

describe('RabbitService', () => {
  let rabbitService: RabbitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    rabbitService = module.get<RabbitService>(RabbitService);
  });

  it('should be defined', () => {
    expect(rabbitService).toBeDefined();
  });

  describe('getRmqOptions', () => {
    it('should be defined', async () => {
      expect(rabbitService.getRmqOptions('authStub')).toBeDefined();
    });

    it('should return RMQ options', () => {
      const mockConfigService = {
        get: jest.fn().mockImplementation((key: string) => {
          switch (key) {
            case 'RABBIT_USER':
              return 'username';
            case 'RABBIT_PASS':
              return 'password';
            case 'RABBIT_HOST':
              return 'localhost';
            case 'RABBIT_PORT':
              return '5672';
          }
        }),
      };

      const queueName = 'test_queue';
      const rabbitService = new RabbitService(mockConfigService as any);
      const rmqOptions = rabbitService.getRmqOptions(queueName);

      expect(mockConfigService.get).toHaveBeenCalledTimes(4);
      expect(rmqOptions).toEqual({
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://username:password@localhost:5672`],
          noAck: false,
          queue: queueName,
          queueOptions: {
            durable: true,
          },
        },
      });
    });
  });

  describe('acknowledgeMessage', () => {
    it('should be defined', async () => {
      rabbitService.acknowledgeMessage(mockRmqContext);

      expect(mockChannel.ack).toBeDefined();
    });

    it('should acknowledge message', () => {
      rabbitService.acknowledgeMessage(mockRmqContext);

      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });
  });
});
