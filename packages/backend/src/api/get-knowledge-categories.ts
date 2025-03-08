import type { Express } from 'express';
import { createApi } from '../create-api';
import type { GetKnowledgeCategoriesReq, GetKnowledgeCategoriesRes } from 'types/api/get-knowledge-categories';
import { fail, succeed } from '../utils/send-res';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';

export const handleGetKnowledgeCategoriesApi = (app: Express) =>
    createApi<GetKnowledgeCategoriesReq, GetKnowledgeCategoriesRes>(
        app,
        '/get-knowledge-categories',
        async (req, res) => {
            try {
                const categories = await KnowledgeCategory.findAll({
                    offset: req.body.from,
                    limit: req.body.count,
                });

                succeed(res, {
                    data: categories.map((i) => ({
                        id: i.id,
                        name: i.name,
                    })),
                });
            } catch (e) {
                fail(res);
            }
        },
    );
