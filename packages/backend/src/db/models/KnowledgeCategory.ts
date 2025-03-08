import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, HasMany, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { Knowledge } from './Knowledge';

export class KnowledgeCategory extends Model<
    InferAttributes<KnowledgeCategory>,
    InferCreationAttributes<KnowledgeCategory>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare name: string;

    @Attribute(DataTypes.TEXT)
    @NotNull()
    declare description: string;

    @HasMany(() => Knowledge, {
        foreignKey: 'categoryId',
        sourceKey: 'id',
        inverse: {
            as: 'category',
        },
    })
    declare items?: NonAttribute<Knowledge[]>;
}
