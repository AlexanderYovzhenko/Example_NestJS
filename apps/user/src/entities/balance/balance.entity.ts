import {
  Column,
  DataType,
  BelongsTo,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../../entities';

interface BalanceCreationAttr {
  id: number;
  main_balance: number;
  hold_balance: number;
  user_id: number;
}

@Table({ tableName: 'balances', timestamps: false })
export class Balance extends Model<Balance, BalanceCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  readonly id: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  main_balance: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  hold_balance: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User, {
    onUpdate: 'CASCADE',
  })
  user: User;
}
