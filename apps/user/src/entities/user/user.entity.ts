import {
  Column,
  DataType,
  HasMany,
  HasOne,
  BelongsTo,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Balance, Profile, Role } from '../../entities';
import { Token } from '@app/auth/entities';
import { Publication } from '@app/publication/entities';

interface UserCreationAttr {
  id: number;
  login: string;
  password: string;
  telegram: string;
  phone?: string;
  role_id: number;
}

@Table({
  tableName: 'users',
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'archived_at',
})
export class User extends Model<User, UserCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  readonly id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  login: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  telegram: string;

  @Column({ type: DataType.STRING, unique: true })
  phone: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id: number;

  @BelongsTo(() => Role, {
    onUpdate: 'CASCADE',
  })
  role: Role;

  @HasMany(() => Token, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  tokens: Token[];

  @HasOne(() => Balance, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  balance: Balance;

  @HasOne(() => Profile, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @HasMany(() => Publication, {
    onUpdate: 'CASCADE',
  })
  publications: Publication[];
}
