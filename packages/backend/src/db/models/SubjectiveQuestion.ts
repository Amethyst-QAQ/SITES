import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, BelongsTo, HasMany, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { ExamSubjectiveQuestion } from './ExamSubjectiveQuestion';
import { SubjectiveAnswer } from './SubjectiveAnswer';
import { Knowledge } from './Knowledge';

export class SubjectiveQuestion extends Model<
    InferAttributes<SubjectiveQuestion>,
    InferCreationAttributes<SubjectiveQuestion>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    declare content: string;

    @Attribute(DataTypes.STRING)
    declare answer: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare knowledgeId: number;

    @HasMany(() => ExamSubjectiveQuestion, {
        foreignKey: 'questionId',
        sourceKey: 'id',
        inverse: {
            as: 'question',
        },
    })
    declare inExam?: NonAttribute<ExamSubjectiveQuestion[]>;

    @HasMany(() => SubjectiveAnswer, {
        foreignKey: 'questionId',
        sourceKey: 'id',
        inverse: {
            as: 'question',
        },
    })
    declare answers?: NonAttribute<SubjectiveAnswer[]>;

    @BelongsTo(() => Knowledge, {
        foreignKey: 'knowledgeId',
        targetKey: 'id',
        inverse: {
            as: 'subjectiveQuestions',
            type: 'hasMany',
        },
    })
    declare knowledge?: NonAttribute<Knowledge>;
}
