import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, BelongsTo, Default, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { ExamInfoCategory } from './ExamInfoCategory';

export class ExamInfo extends Model<InferAttributes<ExamInfo>, InferCreationAttributes<ExamInfo>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare title: string;

    @Attribute(DataTypes.DATE)
    @NotNull()
    @Default(DataTypes.NOW)
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull()
    @Default(DataTypes.NOW)
    declare updatedAt: CreationOptional<Date>;

    @Attribute(DataTypes.TEXT)
    @NotNull()
    declare content: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare categoryId: number;

    @Attribute(DataTypes.BOOLEAN)
    @NotNull()
    @Default(false)
    declare isImportant: CreationOptional<boolean>;

    @BelongsTo(() => ExamInfoCategory, {
        foreignKey: 'categoryId',
        targetKey: 'id',
        inverse: {
            type: 'hasMany',
            as: 'items',
        },
    })
    declare category?: NonAttribute<ExamInfoCategory>;
}
