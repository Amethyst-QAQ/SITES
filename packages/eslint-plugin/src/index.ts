import { jsonApiRule } from './rules/json-api';
import { reqStreamApiRule } from './rules/req-stream-api';

export const plugin = {
    meta: {
        name: 'eslint-plugin',
    },
    rules: {
        'json-api': jsonApiRule,
        'req-stream-api': reqStreamApiRule,
    },
};
