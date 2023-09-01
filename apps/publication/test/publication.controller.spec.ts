import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { PublicationController } from '../src/publication.controller';
import { PublicationService } from '../src/publication.service';
import {
  publicationServiceMock,
  contextMock,
  rabbitServiceMock,
} from './mocks';
import {
  categoryDbStub,
  publicationDbStub,
  queryLimitOffsetCategoryStub,
  querySearchCategoryStub,
} from './stubs';
import { RabbitService } from '@app/shared/services';

describe('PublicationController', () => {
  let publicationController: PublicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationController],
      providers: [
        PublicationService,
        {
          provide: PublicationService,
          useValue: publicationServiceMock,
        },
        {
          provide: 'RABBIT_SERVICE',
          useClass: RabbitService,
        },
        {
          provide: RabbitService,
          useValue: rabbitServiceMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get(): string {
              return 'mock-value';
            },
          },
        },
      ],
    }).compile();

    publicationController = module.get<PublicationController>(
      PublicationController,
    );
  });

  it('should be defined', () => {
    expect(publicationController).toBeDefined();
  });

  describe('addCategory', () => {
    it('should be defined', async () => {
      return expect(
        await publicationController.addCategory(contextMock as RmqContext, {
          category: categoryDbStub(),
        }),
      ).toBeDefined();
    });

    it('should return new category', async () => {
      const result = await publicationController.addCategory(
        contextMock as RmqContext,
        {
          category: categoryDbStub(),
        },
      );

      expect(result).toEqual(categoryDbStub());
    });
  });

  describe('getCategories', () => {
    it('should be defined', async () => {
      return expect(
        await publicationController.getCategories(
          contextMock as RmqContext,
          categoryDbStub().is_news,
        ),
      ).toBeDefined();
    });

    it('should return categories depending on the query params', async () => {
      const result = await publicationController.getCategories(
        contextMock as RmqContext,
        categoryDbStub().is_news,
      );

      expect(result).toEqual({ count: 5, rows: [categoryDbStub()] });
    });
  });

  describe('addPublication', () => {
    it('should be defined', async () => {
      return expect(
        await publicationController.addPublication(contextMock as RmqContext, {
          publication: publicationDbStub(),
        }),
      ).toBeDefined();
    });

    it('should return new publication', async () => {
      const result = await publicationController.addPublication(
        contextMock as RmqContext,
        {
          publication: publicationDbStub(),
        },
      );

      expect(result).toEqual(publicationDbStub());
    });
  });

  describe('getPublication', () => {
    it('should be defined', async () => {
      return expect(
        await publicationController.getPublication(contextMock as RmqContext, {
          id: publicationDbStub().id,
        }),
      ).toBeDefined();
    });

    it('should return publication by id', async () => {
      const result = await publicationController.getPublication(
        contextMock as RmqContext,
        {
          id: publicationDbStub().id,
        },
      );

      expect(result).toEqual(publicationDbStub());
    });
  });

  describe('getPublications', () => {
    it('should be defined', async () => {
      return expect(
        await publicationController.getPublications(contextMock as RmqContext, {
          queryParams: queryLimitOffsetCategoryStub(),
        }),
      ).toBeDefined();
    });

    it('should return publication depending on the query params', async () => {
      const result = await publicationController.getPublications(
        contextMock as RmqContext,
        {
          queryParams: queryLimitOffsetCategoryStub(),
        },
      );

      expect(result).toEqual({ count: 5, rows: [publicationDbStub()] });
    });
  });

  describe('searchPublications', () => {
    it('should be defined', async () => {
      return expect(
        await publicationController.searchPublications(
          contextMock as RmqContext,
          {
            queryParams: querySearchCategoryStub(),
          },
        ),
      ).toBeDefined();
    });

    it('should return search of publication depending on the query params', async () => {
      const result = await publicationController.searchPublications(
        contextMock as RmqContext,
        {
          queryParams: querySearchCategoryStub(),
        },
      );

      expect(result).toEqual({ count: 5, rows: [publicationDbStub()] });
    });
  });

  describe('updatePublication', () => {
    it('should be defined', async () => {
      return expect(
        await publicationController.updatePublication(
          contextMock as RmqContext,
          {
            publication: publicationDbStub(),
            user_role: 'webmaster',
            user_id: 1,
          },
        ),
      ).toBeDefined();
    });

    it('should return update publication', async () => {
      const result = await publicationController.updatePublication(
        contextMock as RmqContext,
        {
          publication: publicationDbStub(),
          user_role: 'webmaster',
          user_id: 1,
        },
      );

      expect(result).toEqual(publicationDbStub());
    });
  });

  describe('deletePublication', () => {
    it('should be defined', async () => {
      return expect(
        await publicationController.deletePublication(
          contextMock as RmqContext,
          {
            publication_id: publicationDbStub().id,
            user_role: 'webmaster',
            user_id: 1,
          },
        ),
      ).toBeDefined();
    });

    it('should return deleted user', async () => {
      const result = await publicationController.deletePublication(
        contextMock as RmqContext,
        {
          publication_id: publicationDbStub().id,
          user_role: 'webmaster',
          user_id: 1,
        },
      );

      expect(result).toEqual(publicationDbStub());
    });
  });
});
