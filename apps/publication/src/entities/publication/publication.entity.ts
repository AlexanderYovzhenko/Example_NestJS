import {
  Column,
  DataType,
  BelongsTo,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Category } from '../category/category.entity';
import { User } from '@app/user/entities';

interface PublicationCreationAttr {
  id: number;
  title: string;
  content: string;
  preview: string;
  is_hidden: boolean;
  user_id: number;
  category_id: number;
}

@Table({
  tableName: 'publications',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Publication extends Model<Publication, PublicationCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  readonly id: number;

  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @Column({ type: DataType.TEXT })
  preview: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_hidden: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @BelongsTo(() => User, {
    onUpdate: 'CASCADE',
  })
  user: User;

  @BelongsTo(() => Category, {
    onUpdate: 'CASCADE',
  })
  category: Category;
}
