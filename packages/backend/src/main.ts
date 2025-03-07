import express from 'express';
import { sequelize } from './db';
import { registerAPIs } from './register-apis';
import { createUploadApi } from './upload-file';

const app = express();

app.use(express.json());

createUploadApi(app);

registerAPIs(app);

app.listen(3000, async () => {
    await sequelize.sync();
    console.log('App listening on port 3000');
});
