import Sequelize from '@sequelize/core';
import { SqliteDialect } from '@sequelize/sqlite3';
import { dataFilePath } from './paths';
import { File } from './models/File';
import { User } from './models/User';

export const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: dataFilePath,
    models: [File, User],
});
