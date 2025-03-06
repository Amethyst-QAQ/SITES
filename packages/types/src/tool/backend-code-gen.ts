import fs from 'fs';
import path from 'path';
import { toCamelCase } from '../lib/to-camel-case.js';
import { packagesDir } from '../lib/path-getter.js';

const apiDefDir = path.resolve(packagesDir, 'types/dist/es/api');
const templatesDir = path.resolve(packagesDir, 'types/templates');
const backendDir = path.resolve(packagesDir, 'backend/src');
const apiDir = path.resolve(backendDir, 'api');

interface API {
    funcName: string;
    backendPath: string;
}

const buildRegisterFuncFile = (apis: API[]) => {
    let source = fs.readFileSync(path.resolve(templatesDir, 'register-apis.ts.template')).toString();

    let imports = '';
    let funcs = '';
    for (const api of apis) {
        imports += `import { ${api.funcName} } from '${api.backendPath}';\n`;
        funcs += `    ${api.funcName}(app);\n`;
    }

    source = source.replaceAll('{{imports}}', imports).replaceAll('{{funcs}}', funcs);
    fs.writeFileSync(path.resolve(backendDir, 'register-apis.ts'), source);
};

const main = async () => {
    const apis: API[] = [];

    // TODO: json api
    const jsonTemplate = fs.readFileSync(path.resolve(templatesDir, 'api-def.ts.template')).toString();
    for (const file of fs.readdirSync(apiDefDir)) {
        if (path.extname(file) == '.js') {
            const fullUrl = `file://${path.resolve(apiDefDir, file)}`;
            const module: { reqType: string; resType: string; apiPath: string } = await import(fullUrl);
            const { reqType, resType, apiPath } = module;

            const apiName = toCamelCase(apiPath);
            const funcName = `handle${apiName}Api`;
            const backendPath = `./api/${file.replace('.js', '')}`;
            apis.push({ funcName, backendPath });

            const code = jsonTemplate
                .replaceAll('{{reqType}}', reqType)
                .replaceAll('{{resType}}', resType)
                .replaceAll('{{apiPath}}', apiPath)
                .replaceAll('{{apiName}}', apiName);

            const outputFile = path.resolve(apiDir, file.replace('.js', '.ts'));
            if (!fs.existsSync(outputFile)) {
                fs.writeFileSync(outputFile, code);
            }
        }
    }

    buildRegisterFuncFile(apis);
};

main();
