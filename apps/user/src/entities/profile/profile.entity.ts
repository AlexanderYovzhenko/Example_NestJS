import {
  Column,
  DataType,
  BelongsTo,
  HasMany,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';

interface ProfileCreationAttr {
  id: number;
  is_ban: boolean;
  over_user?: number;
  user_id: number;
}

@Table({ tableName: 'profiles', timestamps: false })
export class Profile extends Model<Profile, ProfileCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  readonly id: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_ban: boolean;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.INTEGER })
  over_user: number;

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

  @BelongsTo(() => Profile, {
    as: 'overUserProfile',
    onUpdate: 'CASCADE',
  })
  over_user_profile: Profile;

  @HasMany(() => Profile, {
    onUpdate: 'CASCADE',
  })
  employees_profiles: Profile[];
}
