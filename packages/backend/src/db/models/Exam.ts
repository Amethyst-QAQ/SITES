import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, HasMany, NotNull, PrimaryKey, Unique } from '@sequelize/core/decorators-legacy';
import { ExamChoiceQuestion } from './ExamChoiceQuestion';
import { ExamSubjectiveQuestion } from './ExamSubjectiveQuestion';
import { ExamAnswer } from './ExamAnswer';

export class Exam extends Model<InferAttributes<Exam>, InferCreationAttributes<Exam>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull()
    @Unique()
    declare token: string;

    @HasMany(() => ExamChoiceQuestion, {
        foreignKey: 'examId',
        sourceKey: 'id',
        inverse: {
            as: 'exam',
        },
    })
    declare choiceQuestions?: NonAttribute<ExamChoiceQuestion[]>;

    @HasMany(() => ExamSubjectiveQuestion, {
        foreignKey: 'examId',
        sourceKey: 'id',
        inverse: {
            as: 'exam',
        },
    })
    declare subjectiveQuestions?: NonAttribute<ExamSubjectiveQuestion[]>;

    @HasMany(() => ExamAnswer, {
        foreignKey: 'examId',
        sourceKey: 'id',
        inverse: {
            as: 'exam',
        },
    })
    declare answers?: NonAttribute<ExamAnswer[]>;
}
