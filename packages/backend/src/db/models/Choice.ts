import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, BelongsTo, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { ChoiceQuestion } from './ChoiceQuestion';

export class Choice extends Model<InferAttributes<Choice>, InferCreationAttributes<Choice>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare sequenceId: number;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare content: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare questionId: number;

    @BelongsTo(() => ChoiceQuestion, {
        foreignKey: 'questionId',
        targetKey: 'id',
        inverse: {
            type: 'hasMany',
            as: 'choices',
        },
    })
    declare question?: NonAttribute<ChoiceQuestion>;
}
