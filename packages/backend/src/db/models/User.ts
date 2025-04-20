import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import {
    Attribute,
    AutoIncrement,
    Default,
    HasMany,
    HasOne,
    NotNull,
    PrimaryKey,
} from '@sequelize/core/decorators-legacy';
import { PermissionLevel } from 'types/lib/permission-level';
import { LearnRecord } from './LearnRecord';
import { LearnTime } from './LearnTime';
import { OldLearnTime } from './OldLearnTime';
import { ExamAnswer } from './ExamAnswer';
import { Post } from './Post';
import { Comment } from './Comment';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare username: string;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare password: string;

    @Attribute(DataTypes.STRING)
    declare nickname: string | null;

    @Attribute(DataTypes.INTEGER)
    declare avatarId: number | null;

    @Attribute(DataTypes.STRING)
    declare description: string | null;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    @Default(PermissionLevel.NORMAL)
    declare permissionLevel: CreationOptional<PermissionLevel>;

    @HasMany(() => LearnRecord, {
        foreignKey: 'userId',
        sourceKey: 'id',
        inverse: {
            as: 'user',
        },
    })
    declare learnRecords?: NonAttribute<LearnRecord[]>;

    @HasMany(() => LearnTime, {
        foreignKey: 'userId',
        sourceKey: 'id',
        inverse: {
            as: 'user',
        },
    })
    declare learnTime?: NonAttribute<LearnTime[]>;

    @HasOne(() => OldLearnTime, {
        foreignKey: 'userId',
        sourceKey: 'id',
        inverse: {
            as: 'user',
        },
    })
    declare oldLearnTime?: NonAttribute<OldLearnTime>;

    @HasMany(() => ExamAnswer, {
        foreignKey: 'userId',
        sourceKey: 'id',
        inverse: {
            as: 'user',
        },
    })
    declare answers?: NonAttribute<ExamAnswer>;

    @HasMany(() => Post, {
        foreignKey: 'userId',
        sourceKey: 'id',
        inverse: {
            as: 'user',
        },
    })
    declare posts?: NonAttribute<Post[]>;

    @HasMany(() => Comment, {
        foreignKey: 'userId',
        sourceKey: 'id',
        inverse: {
            as: 'user',
        },
    })
    declare comments?: NonAttribute<Comment[]>;
}
