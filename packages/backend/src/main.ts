import express from 'express';
import { sequelize } from './db';
import { registerAPIs } from './register-apis';
import { createFileApi } from './create-file-api';
import { createRootUser } from './create-root-user';

const app = express();

app.use(express.json());

createFileApi(app);

registerAPIs(app);

app.listen(3000, async () => {
    await sequelize.sync();
    await createRootUser();
    console.log('App listening on port 3000');
});
