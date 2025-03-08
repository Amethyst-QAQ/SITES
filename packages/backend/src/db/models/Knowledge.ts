import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, BelongsTo, HasMany, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { KnowledgeCategory } from './KnowledgeCategory';
import { KnowledgeItem } from './KnowledgeItem';

export class Knowledge extends Model<InferAttributes<Knowledge>, InferCreationAttributes<Knowledge>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare title: string;

    @Attribute(DataTypes.FLOAT)
    @NotNull()
    declare importance: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare categoryId: number;

    @BelongsTo(() => KnowledgeCategory, {
        foreignKey: 'categoryId',
        targetKey: 'id',
        inverse: {
            type: 'hasMany',
            as: 'items',
        },
    })
    declare category?: NonAttribute<KnowledgeCategory>;

    @HasMany(() => KnowledgeItem, {
        foreignKey: 'knowledgeId',
        sourceKey: 'id',
        inverse: {
            as: 'knowledge',
        },
    })
    declare items?: NonAttribute<KnowledgeItem[]>;
}
