import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  SequelizeHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators';

@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private db: SequelizeHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'check health server' })
  @Get()
  @HealthCheck()
  async check() {
    const SERVER_URL = await this.configService.get('SERVER_URL');
    const RABBIT_URL = await this.configService.get('RABBIT_URL');
    const TIMEOUT = 5000;

    return this.health.check([
      () => this.db.pingCheck('database'),
      () =>
        this.microservice.pingCheck('rabbitMQ', {
          transport: Transport.RMQ,
          options: {
            urls: [RABBIT_URL],
          },
        }),
      () =>
        this.http.pingCheck('api', SERVER_URL + '/api/health', {
          timeout: TIMEOUT,
        }),
      () =>
        this.http.pingCheck('auth', SERVER_URL + '/auth/health', {
          timeout: TIMEOUT,
        }),
      () =>
        this.http.pingCheck('user', SERVER_URL + '/user/health', {
          timeout: TIMEOUT,
        }),
      () =>
        this.http.pingCheck('telegram', SERVER_URL + '/telegram/health', {
          timeout: TIMEOUT,
        }),
      () =>
        this.http.pingCheck('publication', SERVER_URL + '/publication/health', {
          timeout: TIMEOUT,
        }),
    ]);
  }
}
