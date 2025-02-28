import path from 'path';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let dirName = '';
try {
    dirName = __dirname;
} catch (e) {
    dirName = import.meta.dirname;
}

export const packagesDir = path.resolve(dirName, '../../../..');
