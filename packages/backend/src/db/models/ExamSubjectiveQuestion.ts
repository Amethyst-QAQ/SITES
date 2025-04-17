import type { InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, BelongsTo, NotNull } from '@sequelize/core/decorators-legacy';
import { SubjectiveQuestion } from './SubjectiveQuestion';
import { Exam } from './Exam';

export class ExamSubjectiveQuestion extends Model<
    InferAttributes<ExamSubjectiveQuestion>,
    InferCreationAttributes<ExamSubjectiveQuestion>
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
            as: 'subjectiveQuestions',
            type: 'hasMany',
        },
    })
    declare exam?: NonAttribute<Exam>;

    @BelongsTo(() => SubjectiveQuestion, {
        foreignKey: 'questionId',
        targetKey: 'id',
        inverse: {
            as: 'inExam',
            type: 'hasMany',
        },
    })
    declare question?: NonAttribute<SubjectiveQuestion>;
}
