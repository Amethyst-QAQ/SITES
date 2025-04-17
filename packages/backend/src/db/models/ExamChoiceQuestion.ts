import type { InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, BelongsTo, NotNull } from '@sequelize/core/decorators-legacy';
import { Exam } from './Exam';
import { ChoiceQuestion } from './ChoiceQuestion';

export class ExamChoiceQuestion extends Model<
    InferAttributes<ExamChoiceQuestion>,
    InferCreationAttributes<ExamChoiceQuestion>
> {
    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare examId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare questionId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare sequenceId: number;

    @BelongsTo(() => Exam, {
        foreignKey: 'examId',
        targetKey: 'id',
        inverse: {
            as: 'choiceQuestions',
            type: 'hasMany',
        },
    })
    declare exam?: NonAttribute<Exam>;

    @BelongsTo(() => ChoiceQuestion, {
        foreignKey: 'questionId',
        targetKey: 'id',
        inverse: {
            as: 'inExam',
            type: 'hasMany',
        },
    })
    declare question?: NonAttribute<ChoiceQuestion>;
}
