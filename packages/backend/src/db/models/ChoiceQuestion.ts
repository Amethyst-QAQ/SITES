import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, AutoIncrement, BelongsTo, HasMany, NotNull, PrimaryKey } from '@sequelize/core/decorators-legacy';
import { Choice } from './Choice';
import { ExamChoiceQuestion } from './ExamChoiceQuestion';
import { ChoiceAnswer } from './ChoiceAnswer';
import { Knowledge } from './Knowledge';

export class ChoiceQuestion extends Model<InferAttributes<ChoiceQuestion>, InferCreationAttributes<ChoiceQuestion>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull()
    declare description: string;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare answerSequenceId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare knowledgeId: number;

    @HasMany(() => Choice, {
        foreignKey: 'questionId',
        sourceKey: 'id',
        inverse: {
            as: 'question',
        },
    })
    declare choices?: NonAttribute<Choice[]>;

    @HasMany(() => ExamChoiceQuestion, {
        foreignKey: 'questionId',
        sourceKey: 'id',
        inverse: {
            as: 'question',
        },
    })
    declare inExam?: NonAttribute<ExamChoiceQuestion[]>;

    @HasMany(() => ChoiceAnswer, {
        foreignKey: 'questionId',
        sourceKey: 'id',
        inverse: {
            as: 'question',
        },
    })
    declare answers?: NonAttribute<ChoiceAnswer[]>;

    @BelongsTo(() => Knowledge, {
        foreignKey: 'knowledgeId',
        targetKey: 'id',
        inverse: {
            as: 'choiceQuestions',
            type: 'hasMany',
        },
    })
    declare knowledge?: NonAttribute<Knowledge>;
}
