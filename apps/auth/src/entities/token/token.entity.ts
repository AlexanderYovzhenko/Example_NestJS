import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Info } from '@app/shared/interfaces';
import { User } from '@app/user/entities';

interface TokenCreationAttrs {
  id: string;
  token: string;
  exp: string;
  info?: Info;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'tokens',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Token extends Model<Token, TokenCreationAttrs> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  readonly id: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  token: string;

  @Column({ type: DataType.STRING, allowNull: false })
  exp: string;

  @Column({ type: DataType.JSON })
  info: Info;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @BelongsTo(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;
}
