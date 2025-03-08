import type { InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, BelongsTo, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { User } from './User';

export class OldLearnTime extends Model<InferAttributes<OldLearnTime>, InferCreationAttributes<OldLearnTime>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare time: number;

    @BelongsTo(() => User, {
        foreignKey: 'userId',
        targetKey: 'id',
        inverse: {
            type: 'hasOne',
            as: 'oldLearnTime',
        },
    })
    declare user?: NonAttribute<User>;
}
