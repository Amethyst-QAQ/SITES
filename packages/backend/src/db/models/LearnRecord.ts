import type { InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, BelongsTo, NotNull } from '@sequelize/core/decorators-legacy';
import { User } from './User';
import { KnowledgeItem } from './KnowledgeItem';

export class LearnRecord extends Model<InferAttributes<LearnRecord>, InferCreationAttributes<LearnRecord>> {
    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare knowledgeItemId: number;

    @Attribute(DataTypes.DATE)
    @NotNull()
    declare date: Date;

    @BelongsTo(() => User, {
        foreignKey: 'userId',
        targetKey: 'id',
        inverse: {
            type: 'hasMany',
            as: 'learnRecords',
        },
    })
    declare user?: NonAttribute<User>;

    @BelongsTo(() => KnowledgeItem, {
        foreignKey: 'knowledgeItemId',
        targetKey: 'id',
        inverse: {
            type: 'hasMany',
            as: 'learnRecords',
        },
    })
    declare item?: NonAttribute<KnowledgeItem>;
}
