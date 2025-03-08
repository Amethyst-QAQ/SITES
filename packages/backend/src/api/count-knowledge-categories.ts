import type { Express } from 'express';
import { createApi } from '../create-api';
import type { CountKnowledgeCategoriesReq, CountKnowledgeCategoriesRes } from 'types/api/count-knowledge-categories';
import { fail, succeed } from '../utils/send-res';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';

export const handleCountKnowledgeCategoriesApi = (app: Express) =>
    createApi<CountKnowledgeCategoriesReq, CountKnowledgeCategoriesRes>(
        app,
        '/count-knowledge-categories',
        async (_req, res) => {
            try {
                succeed(res, { count: await KnowledgeCategory.count() });
            } catch (e) {
                fail(res);
            }
        },
    );
