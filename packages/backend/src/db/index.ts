import Sequelize from '@sequelize/core';
import { SqliteDialect } from '@sequelize/sqlite3';
import { dataFilePath } from './paths';
import { File } from './models/File';
import { User } from './models/User';
import { ExamInfo } from './models/ExamInfo';
import { ExamInfoCategory } from './models/ExamInfoCategory';

export const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: dataFilePath,
    models: [File, User, ExamInfo, ExamInfoCategory],
});
