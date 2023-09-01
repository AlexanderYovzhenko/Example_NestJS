import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RabbitService } from '../services/rabbit.service';

@Module({
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {
  static registerRmq(service: string, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const USER = configService.get('RABBIT_USER');
          const PASSWORD = configService.get('RABBIT_PASS');
          const HOST = configService.get('RABBIT_HOST');
          const PORT = configService.get('RABBIT_PORT');

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}:${PORT}`],
              queue,
              queueOptions: {
                durable: true, // queue survives broker restart
              },
            },
          });
        },
      },
    ];

    return {
      module: RabbitModule,
      providers,
      exports: providers,
    };
  }
}
