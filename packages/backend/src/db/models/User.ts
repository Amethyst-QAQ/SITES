import type { CreationOptional, InferAttributes, InferCreationAttributes } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, Default, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { PermissionLevel } from 'types/lib/permission-level';

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
}
