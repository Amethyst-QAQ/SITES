import type { InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, BelongsTo, NotNull } from '@sequelize/core/decorators-legacy';
import { ExamAnswer } from './ExamAnswer';
import { ChoiceQuestion } from './ChoiceQuestion';

export class ChoiceAnswer extends Model<InferAttributes<ChoiceAnswer>, InferCreationAttributes<ChoiceAnswer>> {
    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare answerId: number;
    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare questionId: number;
    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare answerSequenceId: number;

    @BelongsTo(() => ExamAnswer, {
        foreignKey: 'answerId',
        targetKey: 'id',
        inverse: {
            as: 'choiceAnswers',
            type: 'hasMany',
        },
    })
    declare answer?: NonAttribute<ExamAnswer>;

    @BelongsTo(() => ChoiceQuestion, {
        foreignKey: 'questionId',
        targetKey: 'id',
        inverse: {
            as: 'answers',
            type: 'hasMany',
        },
    })
    declare question?: NonAttribute<ChoiceQuestion>;
}
