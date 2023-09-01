import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { User } from '../user/user.entity';

interface RoleCreationAttr {
  id: number;
  value: string;
}

@Table({ tableName: 'roles', timestamps: false })
export class Role extends Model<Role, RoleCreationAttr> {
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

  @HasMany(() => User, {
    onUpdate: 'CASCADE',
  })
  users: User[];
}
