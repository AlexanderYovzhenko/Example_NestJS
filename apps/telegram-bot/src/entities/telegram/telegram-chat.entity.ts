import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface TelegramChatCreationAttr {
  id: number;
  username: string;
  first_name: string;
  chat_id: string;
  is_blocked: boolean;
}

@Table({ tableName: 'telegram_chats', timestamps: false })
export class TelegramChat extends Model<
  TelegramChat,
  TelegramChatCreationAttr
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  readonly id: number;

  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  username: string;

  @Column({ type: DataType.TEXT })
  first_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  chat_id: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_blocked: boolean;
}
