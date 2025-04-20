import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import {
    PrimaryKey,
    AutoIncrement,
    NotNull,
    Default,
    Attribute,
    BelongsTo,
    HasMany,
} from '@sequelize/core/decorators-legacy';
import { User } from './User';
import { Post } from './Post';

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare postId: number;

    @Attribute(DataTypes.TEXT)
    @NotNull()
    declare content: string;

    @Attribute(DataTypes.DATE)
    @Default(DataTypes.NOW)
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.INTEGER)
    declare parentId: CreationOptional<number>;

    @BelongsTo(() => User, {
        foreignKey: 'userId',
        targetKey: 'id',
        inverse: {
            as: 'comments',
            type: 'hasMany',
        },
    })
    declare user?: NonAttribute<User>;

    @BelongsTo(() => Post, {
        foreignKey: 'postId',
        targetKey: 'id',
        inverse: {
            as: 'comments',
            type: 'hasMany',
        },
    })
    declare post?: NonAttribute<Post>;

    @HasMany(() => Comment, {
        foreignKey: 'parentId',
        sourceKey: 'id',
        inverse: {
            as: 'parent',
        },
    })
    declare children?: NonAttribute<Comment>;

    @BelongsTo(() => Comment, {
        foreignKey: 'parentId',
        targetKey: 'id',
        inverse: {
            as: 'children',
            type: 'hasMany',
        },
    })
    declare parent?: NonAttribute<Comment>;
}
