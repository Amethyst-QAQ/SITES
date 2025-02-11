import express from 'express';
import { sequelize } from './db';
import { registerAPIs } from './register-apis';

// 创建Express App
const app = express();

app.use(express.json());

// 注册所有API
// registerAPIs函数是生成的
// 生成过程见packages/types/src/tool/backend-code-gen.ts
registerAPIs(app);

app.listen(3000, async () => {
    // 连接数据库
    await sequelize.sync();
    console.log('App listening on port 3000');
});
