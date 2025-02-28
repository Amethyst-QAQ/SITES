// 生成后端API代码

import fs from 'fs';
import path from 'path';
import { template } from '../lib/template.js';
import { packagesDir } from '../lib/path-getter.js';

// 找到各种文件的目录
const apiDefDir = path.resolve(packagesDir, 'types/dist/es/api');
const jsonApiDefDir = path.resolve(apiDefDir, 'json');
const frontendFileName = path.resolve(packagesDir, 'frontend/src/request/generated.ts');

const main = async () => {
    let code = '';

    for (const file of fs.readdirSync(jsonApiDefDir)) {
        if (path.extname(file) == '.js') {
            const fullUrl = `file://${path.resolve(jsonApiDefDir, file)}`;
            const module: { reqType: string; resType: string; apiPath: string } = await import(fullUrl);
            const { reqType, resType, apiPath } = module;

            const apiCode = template`
            '/${apiPath}': {
                req: import('types/api/json/${apiPath}').${reqType};
                res: import('types/api/json/${apiPath}').${resType};
            };
            `(4);
            code += apiCode;
        }
    }

    const full = template`
    export type GENERATED_API = {
    ${code}
    };
    `(0);

    fs.writeFileSync(frontendFileName, full);
};

main();
