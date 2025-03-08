import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, BelongsTo, HasMany, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { Knowledge } from './Knowledge';
import { LearnRecord } from './LearnRecord';

export class KnowledgeItem extends Model<InferAttributes<KnowledgeItem>, InferCreationAttributes<KnowledgeItem>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare title: string;

    @Attribute(DataTypes.TEXT)
    @NotNull()
    declare content: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare knowledgeId: number;

    @BelongsTo(() => Knowledge, {
        foreignKey: 'knowledgeId',
        targetKey: 'id',
        inverse: {
            type: 'hasMany',
            as: 'items',
        },
    })
    declare knowledge?: NonAttribute<Knowledge>;

    @HasMany(() => LearnRecord, {
        foreignKey: 'knowledgeItemId',
        sourceKey: 'id',
        inverse: {
            as: 'item',
        },
    })
    declare learnRecords?: NonAttribute<LearnRecord[]>;
}
