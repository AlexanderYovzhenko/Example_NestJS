import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PublicationService } from './publication.service';
import { RabbitService } from '@app/shared/services';
import {
  Category,
  Publication,
  QueryLimitOffsetCategory,
  QuerySearchCategory,
} from '@app/shared/interfaces';

@Controller()
export class PublicationController {
  constructor(
    @Inject('RABBIT_SERVICE')
    private readonly rabbitService: RabbitService,
    private readonly publicationService: PublicationService,
  ) {}

  @MessagePattern({ cmd: 'publication_health' })
  async health(@Ctx() context: RmqContext): Promise<boolean> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.publicationService.health();
  }

  @MessagePattern({ cmd: 'add_category' })
  async addCategory(
    @Ctx() context: RmqContext,
    @Payload() data: { category: Category },
  ): Promise<Category | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.publicationService.addCategory(data.category);
  }

  @MessagePattern({ cmd: 'get_all_categories' })
  async getCategories(
    @Ctx() context: RmqContext,
    @Payload('is_news') is_news: boolean,
  ): Promise<{
    rows: Category[];
    count: number;
  }> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.publicationService.getCategories(is_news);
  }

  @MessagePattern({ cmd: 'add_publication' })
  async addPublication(
    @Ctx() context: RmqContext,
    @Payload() data: { publication: Publication },
  ): Promise<Publication | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.publicationService.addPublication(data.publication);
  }

  @MessagePattern({ cmd: 'get_publication' })
  async getPublication(
    @Ctx() context: RmqContext,
    @Payload() data: { id: number },
  ): Promise<Publication> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.publicationService.getPublication(data.id);
  }

  @MessagePattern({ cmd: 'get_all_publications' })
  async getPublications(
    @Ctx() context: RmqContext,
    @Payload() data: { queryParams: QueryLimitOffsetCategory },
  ): Promise<{
    rows: Publication[];
    count: number;
  }> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.publicationService.getPublications(data.queryParams);
  }

  @MessagePattern({ cmd: 'search_publications' })
  async searchPublications(
    @Ctx() context: RmqContext,
    @Payload() data: { queryParams: QuerySearchCategory },
  ): Promise<{
    rows: Publication[];
    count: number;
  }> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.publicationService.searchPublications(data.queryParams);
  }

  @MessagePattern({ cmd: 'update_publication' })
  async updatePublication(
    @Ctx() context: RmqContext,
    @Payload()
    data: { publication: Publication; user_role: string; user_id: number },
  ): Promise<Publication | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.publicationService.updatePublication(
      data.publication,
      data.user_role,
      data.user_id,
    );
  }

  @MessagePattern({ cmd: 'delete_publication' })
  async deletePublication(
    @Ctx() context: RmqContext,
    @Payload()
    data: { publication_id: number; user_role: string; user_id: number },
  ): Promise<Publication | string> {
    this.rabbitService.acknowledgeMessage(context);

    return await this.publicationService.deletePublication(
      data.publication_id,
      data.user_role,
      data.user_id,
    );
  }
}
