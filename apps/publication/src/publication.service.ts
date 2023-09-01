import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import sequelize, { Op } from 'sequelize';
import { Category, Publication } from './entities';
import { User } from '@app/user/entities';
import {
  PUBLICATIONS_DEFAULT_LIMIT,
  PUBLICATIONS_DEFAULT_OFFSET,
} from '@app/shared/constants';
import {
  Category as CategoryInterface,
  Publication as PublicationInterface,
  QueryLimitOffsetCategory,
  QuerySearchCategory,
} from '@app/shared/interfaces';

@Injectable()
export class PublicationService {
  constructor(
    @InjectModel(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectModel(Publication)
    private readonly publicationRepository: Repository<Publication>,
  ) {}

  async health(): Promise<boolean> {
    return true;
  }

  // Category
  async addCategory(
    category: CategoryInterface,
  ): Promise<CategoryInterface | string> {
    const checkCategory = await this.getCategoryByValue(category.value);

    if (checkCategory) {
      return 'category_exists';
    }

    const newCategory = await this.createCategory(category);

    return newCategory;
  }

  async getCategories(is_news: boolean): Promise<{
    rows: CategoryInterface[];
    count: number;
  }> {
    const categories = await this.getCategoriesDependingOnParams(is_news);

    return categories;
  }

  // Publication
  async addPublication(
    publication: PublicationInterface,
  ): Promise<PublicationInterface | string> {
    const checkCategory = await this.getCategoryById(publication.category_id);

    if (!checkCategory) {
      return 'category_not_found';
    }

    const newPublication = await this.createPublication(publication);
    const checkPublication = await this.getPublicationById(newPublication.id);

    return checkPublication;
  }

  async getPublication(id: number): Promise<PublicationInterface> {
    const publication = await this.getPublicationById(id);

    return publication;
  }

  async getPublications(queryParams: QueryLimitOffsetCategory): Promise<{
    rows: PublicationInterface[];
    count: number;
  }> {
    const publications = await this.getPublicationsDependingOnParams(
      queryParams,
    );

    return publications;
  }

  async searchPublications(queryParams: QuerySearchCategory): Promise<{
    rows: PublicationInterface[];
    count: number;
  }> {
    const publications = await this.searchPublicationsDependingOnParams(
      queryParams,
    );

    return publications;
  }

  async updatePublication(
    publication: PublicationInterface,
    user_role: string,
    user_id: number,
  ): Promise<PublicationInterface | string> {
    const checkPublication = await this.getPublicationById(publication.id);

    if (!checkPublication) {
      return null;
    }

    if (
      user_role.toLowerCase() !== 'admin' &&
      user_id !== checkPublication.user_id
    ) {
      return 'forbidden';
    }

    await this.updatePublicationById(publication);
    const updatePublication = await this.getPublicationById(publication.id);

    return updatePublication;
  }

  async deletePublication(
    publication_id: number,
    user_role: string,
    user_id: number,
  ): Promise<PublicationInterface | string> {
    const checkPublication = await this.getPublicationById(publication_id);

    if (!checkPublication) {
      return null;
    }

    if (
      user_role.toLowerCase() !== 'admin' &&
      user_id !== checkPublication.user_id
    ) {
      return 'forbidden';
    }

    await this.deletePublicationById(publication_id);

    return checkPublication;
  }

  // Private methods
  // Category to db methods
  private async createCategory(category: CategoryInterface): Promise<Category> {
    const newCategory = await this.categoryRepository.create({
      value: category.value.toLowerCase(),
      is_news: category.is_news,
    });

    return newCategory;
  }

  private async getCategoryByValue(value: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        value: value.toLowerCase(),
      },
    });

    return category;
  }

  private async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    return category;
  }

  private async getCategoriesDependingOnParams(is_news: boolean): Promise<{
    rows: Category[];
    count: number;
  }> {
    const categories = await this.categoryRepository.findAndCountAll({
      where: {
        is_news: typeof is_news === 'boolean' ? is_news : [true, false],
      },
    });

    return categories;
  }

  // Publication to db methods
  private async createPublication(
    publication: PublicationInterface,
  ): Promise<Publication> {
    const newPublication = await this.publicationRepository.create(publication);

    return newPublication;
  }

  private async getPublicationById(id: number): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Category,
        },
        {
          model: User,
          attributes: ['id', 'login'],
        },
      ],
    });

    return publication;
  }

  private async getPublicationsDependingOnParams(
    queryParams: QueryLimitOffsetCategory,
  ): Promise<{
    rows: Publication[];
    count: number;
  }> {
    const limit = queryParams.limit
      ? queryParams.limit
      : PUBLICATIONS_DEFAULT_LIMIT;
    const offset = queryParams.offset
      ? queryParams.offset
      : PUBLICATIONS_DEFAULT_OFFSET;
    const is_news = queryParams.is_news;
    const is_hidden = queryParams.is_hidden;
    const isFirstNew = queryParams.is_first_new;
    const categories = queryParams.categories[0]
      ? queryParams.categories.map((category: string) => category.toLowerCase())
      : [''];
    const author = queryParams.author ? queryParams.author.toLowerCase() : '';

    const publications = await this.publicationRepository.findAndCountAll({
      limit,
      offset,
      order: isFirstNew ? [['created_at', 'DESC']] : [['created_at', 'ASC']],
      where: {
        is_hidden: typeof is_hidden === 'boolean' ? is_hidden : [true, false],
      },
      include: [
        {
          model: Category,
          where: {
            value: categories[0]
              ? { [Op.in]: categories }
              : { [Op.substring]: categories },
            is_news: typeof is_news === 'boolean' ? is_news : [true, false],
          },
        },
        {
          model: User,
          attributes: ['id', 'login'],
          where: {
            login: author ? author : { [Op.substring]: author },
          },
        },
      ],
    });

    return publications;
  }

  private async searchPublicationsDependingOnParams(
    queryParams: QuerySearchCategory,
  ): Promise<{
    rows: Publication[];
    count: number;
  }> {
    const search = queryParams.search.toLowerCase();
    const is_news = queryParams.is_news;
    const is_hidden = queryParams.is_hidden;
    const isFirstNew = queryParams.is_first_new;
    const categories = queryParams.categories[0]
      ? queryParams.categories.map((category: string) => category.toLowerCase())
      : [''];
    const author = queryParams.author ? queryParams.author.toLowerCase() : '';

    const publications = await this.publicationRepository.findAndCountAll({
      order: isFirstNew ? [['created_at', 'DESC']] : [['created_at', 'ASC']],
      where: {
        [Op.and]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), {
            [Op.substring]: search,
          }),
          {
            is_hidden:
              typeof is_hidden === 'boolean' ? is_hidden : [true, false],
          },
        ],
      },
      include: [
        {
          model: Category,
          where: {
            value: categories[0]
              ? { [Op.in]: categories }
              : { [Op.substring]: categories },
            is_news: typeof is_news === 'boolean' ? is_news : [true, false],
          },
        },
        {
          model: User,
          attributes: ['id', 'login'],
          where: {
            login: author ? author : { [Op.substring]: author },
          },
        },
      ],
    });

    return publications;
  }

  private async updatePublicationById(
    publication: PublicationInterface,
  ): Promise<void> {
    await this.publicationRepository.update(
      { ...publication },
      {
        where: {
          id: publication.id,
        },
      },
    );
  }

  private async deletePublicationById(id: number): Promise<void> {
    await this.publicationRepository.destroy({
      where: {
        id,
      },
      force: true,
    });
  }
}
