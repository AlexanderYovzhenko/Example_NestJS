import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiService } from '../api.service';
import { schemaStatus } from '../schemas-response-swagger';
import { Public } from '../common/decorators';
import { Status } from '@app/shared/interfaces';

@ApiTags('Api')
@Public()
@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({ summary: 'check health - only for endpoint of health' })
  @ApiOkResponse({ schema: schemaStatus })
  @Public()
  @Get('api/health')
  async health(): Promise<Status> {
    const status: boolean = await this.apiService.health();

    return { status, message: 'api is running' };
  }

  @ApiOperation({ summary: 'check home' })
  @ApiOkResponse({ schema: schemaStatus })
  @Get()
  async checkHome(): Promise<Status> {
    const status: boolean = await this.apiService.checkHome();

    return { status, message: 'server is running' };
  }
}
