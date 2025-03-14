import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, HasMany, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { ExamInfo } from './ExamInfo';

export class ExamInfoCategory extends Model<
    InferAttributes<ExamInfoCategory>,
    InferCreationAttributes<ExamInfoCategory>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare name: string;

    @HasMany(() => ExamInfo, {
        foreignKey: 'categoryId',
        sourceKey: 'id',
        inverse: {
            as: 'category',
        },
    })
    declare items?: NonAttribute<ExamInfo[]>;
}
