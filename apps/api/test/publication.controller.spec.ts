import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { PublicationController } from '../src/controllers';
import { publicationServiceMock } from './mocks';
import {
  categoryDbStub,
  publicationDbStub,
  jwtPayloadAccessTokenStub,
  queryLimitOffsetCategoryStub,
  querySearchCategoryStub,
} from './stubs';
import {
  ACCESS_DENIED,
  PUBLICATION_CATEGORY_ALREADY_EXISTS,
  PUBLICATION_CATEGORY_NOT_FOUND,
  PUBLICATION_NOT_FOUND,
} from '@app/shared/constants';

describe('PublicationController', () => {
  let publicationController: PublicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationController],
      providers: [
        {
          provide: 'PUBLICATION_SERVICE',
          useValue: publicationServiceMock,
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
    it('should be defined', () => {
      expect(
        publicationController.addCategory({
          value: 'newCategory',
          is_news: false,
        }),
      ).toBeDefined();
    });

    it('should be return 409 error and message - category already exists', async () => {
      try {
        await publicationController.addCategory(categoryDbStub());
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.CONFLICT);
        expect(error.message).toEqual(PUBLICATION_CATEGORY_ALREADY_EXISTS);
      }
    });

    it('should return new category', async () => {
      expect(
        await publicationController.addCategory({
          value: 'newCategory',
          is_news: false,
        }),
      ).toEqual(categoryDbStub());
    });
  });

  describe('getCategories', () => {
    it('should be defined', () => {
      expect(
        publicationController.getCategories({
          is_news: categoryDbStub().is_news,
        }),
      ).toBeDefined();
    });

    it('should return categories depending on the query params', async () => {
      expect(
        await publicationController.getCategories({
          is_news: categoryDbStub().is_news,
        }),
      ).toEqual({
        count: 5,
        rows: [categoryDbStub()],
      });
    });
  });

  describe('addPublication', () => {
    it('should be defined', () => {
      expect(
        publicationController.addPublication(publicationDbStub().id, {
          title: publicationDbStub().title,
          content: 'content',
          preview: publicationDbStub().preview,
          category_id: publicationDbStub().category_id,
        }),
      ).toBeDefined();
    });

    it('should be return 404 error and message - category not found', async () => {
      try {
        const fakeId = 123;

        await publicationController.addPublication(publicationDbStub().id, {
          title: publicationDbStub().title,
          content: 'content',
          preview: publicationDbStub().preview,
          category_id: fakeId,
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toEqual(PUBLICATION_CATEGORY_NOT_FOUND);
      }
    });

    it('should return new publication', async () => {
      expect(
        await publicationController.addPublication(publicationDbStub().id, {
          title: publicationDbStub().title,
          content: 'content',
          preview: publicationDbStub().preview,
          category_id: publicationDbStub().category_id,
        }),
      ).toEqual(publicationDbStub());
    });
  });

  describe('getPublication', () => {
    it('should be defined', () => {
      expect(
        publicationController.getPublication(publicationDbStub().id),
      ).toBeDefined();
    });

    it('should be return 404 error and message - publication not found', async () => {
      try {
        const fakeId = 123;

        await publicationController.getPublication(fakeId);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toEqual(PUBLICATION_NOT_FOUND);
      }
    });

    it('should return publication by id', async () => {
      expect(
        await publicationController.getPublication(publicationDbStub().id),
      ).toEqual(publicationDbStub());
    });
  });

  describe('getPublications', () => {
    it('should be defined', () => {
      expect(
        publicationController.getPublications(queryLimitOffsetCategoryStub()),
      ).toBeDefined();
    });

    it('should return publications depending on the query params', async () => {
      expect(
        await publicationController.getPublications(
          queryLimitOffsetCategoryStub(),
        ),
      ).toEqual({ count: 5, rows: [publicationDbStub()] });
    });
  });

  describe('searchPublications', () => {
    it('should be defined', () => {
      expect(
        publicationController.searchPublications(querySearchCategoryStub()),
      ).toBeDefined();
    });

    it('should return search of publications depending on the query params', async () => {
      expect(
        await publicationController.searchPublications(
          querySearchCategoryStub(),
        ),
      ).toEqual({ count: 5, rows: [publicationDbStub()] });
    });
  });

  describe('updatePublication', () => {
    it('should be defined', async () => {
      expect(
        await publicationController.updatePublication(
          publicationDbStub().id,
          {
            title: publicationDbStub().title,
            content: 'content',
            preview: publicationDbStub().preview,
            category_id: publicationDbStub().category_id,
          },
          jwtPayloadAccessTokenStub(),
        ),
      ).toBeDefined();
    });

    it('should be return 404 error and message - publication not found', async () => {
      try {
        const fakeId = 123;

        await publicationController.updatePublication(
          fakeId,
          {
            title: publicationDbStub().title,
            content: 'content',
            preview: publicationDbStub().preview,
            category_id: publicationDbStub().category_id,
          },
          jwtPayloadAccessTokenStub(),
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toEqual(PUBLICATION_NOT_FOUND);
      }
    });

    it('should be return 403 error and message - access denied', async () => {
      try {
        const fakeId = 123;

        await publicationController.updatePublication(
          publicationDbStub().id,
          {
            title: publicationDbStub().title,
            content: 'content',
            preview: publicationDbStub().preview,
            category_id: publicationDbStub().category_id,
          },
          { ...jwtPayloadAccessTokenStub(), id: fakeId },
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual(ACCESS_DENIED);
      }
    });

    it('should return update publication', async () => {
      expect(
        await publicationController.updatePublication(
          publicationDbStub().id,
          {
            title: publicationDbStub().title,
            content: 'content',
            preview: publicationDbStub().preview,
            category_id: publicationDbStub().category_id,
          },
          jwtPayloadAccessTokenStub(),
        ),
      ).toEqual(publicationDbStub());
    });
  });

  describe('deletePublication', () => {
    it('should be defined', async () => {
      expect(
        await publicationController.deletePublication(
          publicationDbStub().id,
          jwtPayloadAccessTokenStub(),
        ),
      ).toBeDefined();
    });

    it('should be return 404 error and message - publication not found', async () => {
      try {
        const fakeId = 123;

        await publicationController.deletePublication(
          fakeId,
          jwtPayloadAccessTokenStub(),
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
        expect(error.message).toEqual(PUBLICATION_NOT_FOUND);
      }
    });

    it('should be return 403 error and message - access denied', async () => {
      try {
        const fakeId = 123;

        await publicationController.deletePublication(publicationDbStub().id, {
          ...jwtPayloadAccessTokenStub(),
          id: fakeId,
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual(ACCESS_DENIED);
      }
    });

    it('should return deleted publication', async () => {
      expect(
        await publicationController.deletePublication(
          publicationDbStub().id,
          jwtPayloadAccessTokenStub(),
        ),
      ).toEqual(publicationDbStub());
    });
  });
});
