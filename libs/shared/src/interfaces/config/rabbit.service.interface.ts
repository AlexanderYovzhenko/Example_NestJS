import { RmqContext, RmqOptions } from '@nestjs/microservices';

export interface RabbitServiceInterface {
  getRmqOptions(queue: string): RmqOptions;
  acknowledgeMessage(context: RmqContext): void;
}
