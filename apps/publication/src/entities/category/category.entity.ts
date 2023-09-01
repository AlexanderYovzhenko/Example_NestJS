import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { Publication } from '../publication/publication.entity';

interface CategoryCreationAttr {
  id: number;
  value: string;
  is_news: boolean;
}

@Table({ tableName: 'publication_categories', timestamps: false })
export class Category extends Model<Category, CategoryCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  readonly id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  value: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  is_news: boolean;

  @HasMany(() => Publication, {
    onUpdate: 'CASCADE',
  })
  publications: Publication[];
}
