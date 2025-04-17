import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from '@sequelize/core';
import { DataTypes, Model } from '@sequelize/core';
import {
    Attribute,
    AutoIncrement,
    BelongsTo,
    Default,
    HasMany,
    NotNull,
    PrimaryKey,
} from '@sequelize/core/decorators-legacy';
import { Exam } from './Exam';
import { User } from './User';
import { ChoiceAnswer } from './ChoiceAnswer';
import { SubjectiveAnswer } from './SubjectiveAnswer';

export class ExamAnswer extends Model<InferAttributes<ExamAnswer>, InferCreationAttributes<ExamAnswer>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey()
    @AutoIncrement()
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.DATE)
    @NotNull()
    @Default(DataTypes.NOW)
    declare date: CreationOptional<Date>;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull()
    declare examId: number;

    @BelongsTo(() => Exam, {
        foreignKey: 'examId',
        targetKey: 'id',
        inverse: {
            as: 'answers',
            type: 'hasMany',
        },
    })
    declare exam?: NonAttribute<Exam>;

    @BelongsTo(() => User, {
        foreignKey: 'userId',
        targetKey: 'id',
        inverse: {
            as: 'answers',
            type: 'hasMany',
        },
    })
    declare user?: NonAttribute<User>;

    @HasMany(() => ChoiceAnswer, {
        foreignKey: 'answerId',
        sourceKey: 'id',
        inverse: {
            as: 'answer',
        },
    })
    declare choiceAnswers?: NonAttribute<ChoiceAnswer[]>;

    @HasMany(() => SubjectiveAnswer, {
        foreignKey: 'answerId',
        sourceKey: 'id',
        inverse: {
            as: 'examAnswer',
        },
    })
    declare subjectiveAnswers?: NonAttribute<SubjectiveAnswer[]>;
}
