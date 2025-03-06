import { apiDefRule } from './rules/api-def';

export const plugin = {
    meta: {
        name: 'eslint-plugin',
    },
    rules: {
        'api-def': apiDefRule,
    },
};
