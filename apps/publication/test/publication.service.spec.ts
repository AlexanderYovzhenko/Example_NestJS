import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { PublicationService } from '../src/publication.service';
import { categoryRepositoryMock, publicationRepositoryMock } from './mocks';
import {
  categoryDbStub,
  publicationDbStub,
  queryLimitOffsetCategoryStub,
  querySearchCategoryStub,
} from './stubs';
import { Category, Publication } from '@app/publication/entities';

describe('PublicationService', () => {
  let publicationService: PublicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicationService,
        {
          provide: getModelToken(Category),
          useValue: categoryRepositoryMock,
        },
        {
          provide: getModelToken(Publication),
          useValue: publicationRepositoryMock,
        },
      ],
    }).compile();

    publicationService = module.get<PublicationService>(PublicationService);
  });

  it('should be defined', () => {
    expect(publicationService).toBeDefined();
  });

  describe('addCategory', () => {
    it('should be defined', async () => {
      expect(
        await publicationService.addCategory(categoryDbStub()),
      ).toBeDefined();
    });

    it('should return category exists', async () => {
      expect(await publicationService.addCategory(categoryDbStub())).toEqual(
        'category_exists',
      );
    });

    it('should return new category', async () => {
      expect(
        await publicationService.addCategory({
          ...categoryDbStub(),
          value: 'avito',
        }),
      ).toEqual(categoryDbStub());
    });
  });

  describe('getCategories', () => {
    it('should be defined', async () => {
      expect(
        await publicationService.getCategories(categoryDbStub().is_news),
      ).toBeDefined();
    });

    it('should return all categories', async () => {
      expect(
        await publicationService.getCategories(categoryDbStub().is_news),
      ).toEqual({
        count: 5,
        rows: [categoryDbStub()],
      });
    });
  });

  describe('addPublication', () => {
    it('should be defined', async () => {
      expect(
        await publicationService.addPublication(publicationDbStub()),
      ).toBeDefined();
    });

    it('should return category_not_found', async () => {
      const fakeId = 123;

      expect(
        await publicationService.addPublication({
          ...publicationDbStub(),
          category_id: fakeId,
        }),
      ).toEqual('category_not_found');
    });

    it('should return new publication', async () => {
      expect(
        await publicationService.addPublication(publicationDbStub()),
      ).toEqual(publicationDbStub());
    });
  });

  describe('getPublication', () => {
    it('should be defined', async () => {
      expect(
        await publicationService.getPublication(publicationDbStub().id),
      ).toBeDefined();
    });

    it('should return null publication not found', async () => {
      const fakeId = 123;

      expect(await publicationService.getPublication(fakeId)).toEqual(null);
    });

    it('should return publication by id', async () => {
      expect(
        await publicationService.getPublication(publicationDbStub().id),
      ).toEqual(publicationDbStub());
    });
  });

  describe('getPublications', () => {
    it('should be defined', async () => {
      expect(
        await publicationService.getPublications(
          queryLimitOffsetCategoryStub(),
        ),
      ).toBeDefined();
    });

    it('should return all publications depending on the query params', async () => {
      expect(
        await publicationService.getPublications(
          queryLimitOffsetCategoryStub(),
        ),
      ).toEqual({ count: 5, rows: [publicationDbStub()] });
    });
  });

  describe('searchPublications', () => {
    it('should be defined', async () => {
      expect(
        await publicationService.searchPublications(querySearchCategoryStub()),
      ).toBeDefined();
    });

    it('should return search of publications depending on the query params', async () => {
      expect(
        await publicationService.searchPublications(querySearchCategoryStub()),
      ).toEqual({ count: 5, rows: [publicationDbStub()] });
    });
  });

  describe('updatePublication', () => {
    it('should be defined', async () => {
      expect(
        await publicationService.updatePublication(
          publicationDbStub(),
          'webmaster',
          publicationDbStub().user_id,
        ),
      ).toBeDefined();
    });

    it('should return forbidden', async () => {
      expect(
        await publicationService.updatePublication(
          publicationDbStub(),
          'webmaster',
          2,
        ),
      ).toEqual('forbidden');
    });

    it('should return update publication', async () => {
      expect(
        await publicationService.updatePublication(
          publicationDbStub(),
          'webmaster',
          publicationDbStub().user_id,
        ),
      ).toEqual(publicationDbStub());
    });

    it('should return update publication if role admin', async () => {
      expect(
        await publicationService.updatePublication(
          publicationDbStub(),
          'Admin',
          2,
        ),
      ).toEqual(publicationDbStub());
    });
  });

  describe('deletePublication', () => {
    it('should be defined', async () => {
      expect(
        await publicationService.deletePublication(
          publicationDbStub().id,
          'webmaster',
          publicationDbStub().user_id,
        ),
      ).toBeDefined();
    });

    it('should return null publication not found', async () => {
      const fakeId = 123;

      expect(
        await publicationService.deletePublication(
          fakeId,
          'webmaster',
          publicationDbStub().user_id,
        ),
      ).toEqual(null);
    });

    it('should return forbidden', async () => {
      expect(
        await publicationService.deletePublication(
          publicationDbStub().id,
          'webmaster',
          2,
        ),
      ).toEqual('forbidden');
    });

    it('should return delete publication', async () => {
      expect(
        await publicationService.deletePublication(
          publicationDbStub().id,
          'webmaster',
          publicationDbStub().user_id,
        ),
      ).toEqual(publicationDbStub());
    });

    it('should return delete publication if role admin', async () => {
      expect(
        await publicationService.deletePublication(
          publicationDbStub().id,
          'Admin',
          2,
        ),
      ).toEqual(publicationDbStub());
    });
  });
});
