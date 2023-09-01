import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ConfirmCodeCreationAttr {
  id: number;
  request_id: string;
  code: string;
  is_confirmed: boolean;
}

@Table({
  tableName: 'confirm_codes',
  createdAt: 'created_at',
  updatedAt: false,
})
export class ConfirmCode extends Model<ConfirmCode, ConfirmCodeCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  readonly id: number;

  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  request_id: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  code: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_confirmed: boolean;
}
