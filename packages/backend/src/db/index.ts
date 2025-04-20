import Sequelize from '@sequelize/core';
import { SqliteDialect } from '@sequelize/sqlite3';
import { dataFilePath } from './paths';
import { File } from './models/File';
import { User } from './models/User';
import { ExamInfo } from './models/ExamInfo';
import { ExamInfoCategory } from './models/ExamInfoCategory';
import { KnowledgeCategory } from './models/KnowledgeCategory';
import { Knowledge } from './models/Knowledge';
import { KnowledgeItem } from './models/KnowledgeItem';
import { LearnRecord } from './models/LearnRecord';
import { LearnTime } from './models/LearnTime';
import { OldLearnTime } from './models/OldLearnTime';
import { ChoiceQuestion } from './models/ChoiceQuestion';
import { SubjectiveQuestion } from './models/SubjectiveQuestion';
import { Choice } from './models/Choice';
import { Exam } from './models/Exam';
import { ExamChoiceQuestion } from './models/ExamChoiceQuestion';
import { ExamSubjectiveQuestion } from './models/ExamSubjectiveQuestion';
import { ExamAnswer } from './models/ExamAnswer';
import { ChoiceAnswer } from './models/ChoiceAnswer';
import { SubjectiveAnswer } from './models/SubjectiveAnswer';
import { Post } from './models/Post';
import { Comment } from './models/Comment';

export const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: dataFilePath,
    models: [
        File,
        User,
        ExamInfo,
        ExamInfoCategory,
        KnowledgeCategory,
        Knowledge,
        KnowledgeItem,
        LearnRecord,
        LearnTime,
        OldLearnTime,
        ChoiceQuestion,
        SubjectiveQuestion,
        Choice,
        Exam,
        ExamChoiceQuestion,
        ExamSubjectiveQuestion,
        ExamAnswer,
        ChoiceAnswer,
        SubjectiveAnswer,
        Post,
        Comment,
    ],
});
