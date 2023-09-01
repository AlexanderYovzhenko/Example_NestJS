import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  Controller,
  Body,
  Post,
  Put,
  Get,
  Delete,
  Inject,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import {
  schemaStatus,
  schemaCategory,
  schemaCategories,
  schemaPublication,
  schemaPublications,
  schemaError400,
  schemaError401,
  schemaError403,
  schemaError404,
  schemaError409,
} from '../schemas-response-swagger';
import {
  CreateCategoryDto,
  CreatePublicationDto,
  GetCategoriesQueryDto,
  GetPublicationsQueryDto,
  SearchPublicationsQueryDto,
  UpdatePublicationDto,
} from '../dto';
import { GetCurrentUser, Public, Roles } from '../common/decorators';
import {
  ACCESS_DENIED,
  PUBLICATION_CATEGORY_ALREADY_EXISTS,
  PUBLICATION_CATEGORY_NOT_FOUND,
  PUBLICATION_NOT_FOUND,
} from '@app/shared/constants';
import {
  Category,
  JwtPayloadAccessToken,
  Publication,
  Status,
} from '@app/shared/interfaces';

@ApiTags('Publication')
@Controller('publication')
export class PublicationController {
  constructor(
    @Inject('PUBLICATION_SERVICE')
    private readonly publicationService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'check health - only for endpoint of health' })
  @ApiOkResponse({ schema: schemaStatus })
  @Public()
  @Get('health')
  async health(): Promise<Status> {
    const status: boolean = await firstValueFrom(
      this.publicationService.send(
        {
          cmd: 'publication_health',
        },

        {},
      ),
    );

    return { status, message: 'publication is running' };
  }

  // Category
  @ApiBearerAuth()
  @ApiOperation({ summary: 'add category - only for admin' })
  @ApiCreatedResponse({ schema: schemaCategory })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiConflictResponse({ schema: schemaError409 })
  @Roles('ADMIN')
  @Post('add-category')
  async addCategory(@Body() category: CreateCategoryDto): Promise<Category> {
    const newCategory: Category | string = await firstValueFrom(
      this.publicationService.send(
        {
          cmd: 'add_category',
        },

        {
          category,
        },
      ),
    );

    if (newCategory === 'category_exists') {
      throw new ConflictException(PUBLICATION_CATEGORY_ALREADY_EXISTS);
    }

    if (typeof newCategory !== 'string') {
      return newCategory;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get categories - depending on the query params' })
  @ApiOkResponse({ schema: schemaCategories })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @Get('get-categories')
  async getCategories(@Query() queryParams: GetCategoriesQueryDto): Promise<{
    rows: Category[];
    count: number;
  }> {
    const categories: {
      rows: Category[];
      count: number;
    } = await firstValueFrom(
      this.publicationService.send(
        {
          cmd: 'get_all_categories',
        },

        {
          is_news: queryParams.is_news,
        },
      ),
    );

    return categories;
  }

  // Publication
  @ApiBearerAuth()
  @ApiOperation({ summary: 'add publication' })
  @ApiCreatedResponse({ schema: schemaPublication })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @Post('add-publication')
  async addPublication(
    @GetCurrentUser('id') id: number,
    @Body() publication: CreatePublicationDto,
  ): Promise<Publication> {
    const newPublication: Publication | string = await firstValueFrom(
      this.publicationService.send(
        {
          cmd: 'add_publication',
        },

        {
          publication: { ...publication, user_id: id },
        },
      ),
    );

    if (newPublication === 'category_not_found') {
      throw new NotFoundException(PUBLICATION_CATEGORY_NOT_FOUND);
    }

    if (typeof newPublication !== 'string') {
      return newPublication;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get publication by id' })
  @ApiOkResponse({ schema: schemaPublication })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @Get('get-publication/:id')
  async getPublication(@Param('id') id: number): Promise<Publication> {
    const publication: Publication = await firstValueFrom(
      this.publicationService.send(
        {
          cmd: 'get_publication',
        },

        {
          id,
        },
      ),
    );

    if (!publication) {
      throw new NotFoundException(PUBLICATION_NOT_FOUND);
    }

    return publication;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get publications - depending on the query params',
  })
  @ApiOkResponse({ schema: schemaPublications })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @Get('get-publications')
  async getPublications(
    @Query() queryParams: GetPublicationsQueryDto,
  ): Promise<{
    rows: Publication[];
    count: number;
  }> {
    const categories = Array.isArray(queryParams.categories)
      ? queryParams.categories
      : [queryParams.categories];

    const publications: {
      rows: Publication[];
      count: number;
    } = await firstValueFrom(
      this.publicationService.send(
        {
          cmd: 'get_all_publications',
        },

        {
          queryParams: {
            ...queryParams,
            categories,
          },
        },
      ),
    );

    return publications;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'search of publications - depending on the query params',
  })
  @ApiOkResponse({ schema: schemaPublications })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @Get('search-publications')
  async searchPublications(
    @Query() queryParams: SearchPublicationsQueryDto,
  ): Promise<{
    rows: Publication[];
    count: number;
  }> {
    const categories = Array.isArray(queryParams.categories)
      ? queryParams.categories
      : [queryParams.categories];

    const publications: {
      rows: Publication[];
      count: number;
    } = await firstValueFrom(
      this.publicationService.send(
        {
          cmd: 'search_publications',
        },

        {
          queryParams: {
            ...queryParams,
            categories,
          },
        },
      ),
    );

    return publications;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'update publication - only for admin or own publication',
  })
  @ApiCreatedResponse({ schema: schemaPublication })
  @ApiBadRequestResponse({ schema: schemaError400 })
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @HttpCode(HttpStatus.CREATED)
  @Put('update-publication/:id')
  async updatePublication(
    @Param('id') id: number,
    @Body() publication: UpdatePublicationDto,
    @GetCurrentUser() user: JwtPayloadAccessToken,
  ): Promise<Publication> {
    const updatePublication: Publication | string = await firstValueFrom(
      this.publicationService.send(
        {
          cmd: 'update_publication',
        },

        {
          publication: { ...publication, id },
          user_role: user.role,
          user_id: user.id,
        },
      ),
    );

    if (!updatePublication) {
      throw new NotFoundException(PUBLICATION_NOT_FOUND);
    }

    if (updatePublication === 'forbidden') {
      throw new ForbiddenException(ACCESS_DENIED);
    }

    if (typeof updatePublication !== 'string') {
      return updatePublication;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'delete publication - only for admin or own publication',
  })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ schema: schemaError401 })
  @ApiForbiddenResponse({ schema: schemaError403 })
  @ApiNotFoundResponse({ schema: schemaError404 })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete-publication/:id')
  async deletePublication(
    @Param('id') id: number,
    @GetCurrentUser() user: JwtPayloadAccessToken,
  ): Promise<Publication> {
    const deletePublication: Publication | string = await firstValueFrom(
      this.publicationService.send(
        {
          cmd: 'delete_publication',
        },

        {
          publication_id: id,
          user_role: user.role,
          user_id: user.id,
        },
      ),
    );

    if (!deletePublication) {
      throw new NotFoundException(PUBLICATION_NOT_FOUND);
    }

    if (deletePublication === 'forbidden') {
      throw new ForbiddenException(ACCESS_DENIED);
    }

    if (typeof deletePublication !== 'string') {
      return deletePublication;
    }
  }
}
