import type { InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, BelongsTo, NotNull, Unique } from '@sequelize/core/decorators-legacy';
import { User } from './User';

export class LearnTime extends Model<InferAttributes<LearnTime>, InferCreationAttributes<LearnTime>> {
    @Attribute(DataTypes.INTEGER)
    @NotNull()
    @Unique()
    declare userId: number;

    @Attribute(DataTypes.DATE)
    @NotNull()
    declare startAt: Date;

    @Attribute(DataTypes.DATE)
    @NotNull()
    declare endAt: Date;

    @BelongsTo(() => User, {
        foreignKey: 'userId',
        targetKey: 'id',
        inverse: {
            type: 'hasMany',
            as: 'learnTime',
        },
    })
    declare user?: NonAttribute<User>;
}
