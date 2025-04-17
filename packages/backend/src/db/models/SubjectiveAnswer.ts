import type { InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, BelongsTo, NotNull } from '@sequelize/core/decorators-legacy';
import { ExamAnswer } from './ExamAnswer';
import { SubjectiveQuestion } from './SubjectiveQuestion';

export class SubjectiveAnswer extends Model<
    InferAttributes<SubjectiveAnswer>,
    InferCreationAttributes<SubjectiveAnswer>
> {
    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare answerId: number;
    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare questionId: number;
    @Attribute(DataTypes.STRING)
    @NotNull()
    declare answer: string;

    @BelongsTo(() => ExamAnswer, {
        foreignKey: 'answerId',
        targetKey: 'id',
        inverse: {
            as: 'subjectiveAnswers',
            type: 'hasMany',
        },
    })
    declare examAnswer?: NonAttribute<ExamAnswer>;

    @BelongsTo(() => SubjectiveQuestion, {
        foreignKey: 'questionId',
        targetKey: 'id',
        inverse: {
            as: 'answers',
            type: 'hasMany',
        },
    })
    declare question?: NonAttribute<SubjectiveQuestion>;
}
