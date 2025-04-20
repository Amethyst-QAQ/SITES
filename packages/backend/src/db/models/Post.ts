import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import {
    Attribute,
    AutoIncrement,
    BelongsTo,
    Default,
    HasMany,
    NotNull,
    PrimaryKey,
} from '@sequelize/core/decorators-legacy';
import { User } from './User';
import { Comment } from './Comment';

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare userId: number;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare title: string;

    @Attribute(DataTypes.TEXT)
    @NotNull()
    declare content: string;

    @Attribute(DataTypes.DATE)
    @Default(DataTypes.NOW)
    declare createdAt: CreationOptional<Date>;

    @BelongsTo(() => User, {
        foreignKey: 'userId',
        targetKey: 'id',
        inverse: {
            as: 'posts',
            type: 'hasMany',
        },
    })
    declare user?: NonAttribute<User>;

    @HasMany(() => Comment, {
        foreignKey: 'postId',
        sourceKey: 'id',
        inverse: {
            as: 'post',
        },
    })
    declare comments?: NonAttribute<Comment[]>;
}
