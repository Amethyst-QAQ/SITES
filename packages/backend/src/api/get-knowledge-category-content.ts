import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetKnowledgeCategoryContentFail,
    type GetKnowledgeCategoryContentReq,
    type GetKnowledgeCategoryContentRes,
} from 'types/api/get-knowledge-category-content';
import { failWithReason, succeed } from '../utils/send-res';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';

export const handleGetKnowledgeCategoryContentApi = (app: Express) =>
    createApi<GetKnowledgeCategoryContentReq, GetKnowledgeCategoryContentRes>(
        app,
        '/get-knowledge-category-content',
        async (req, res) => {
            try {
                const category = await KnowledgeCategory.findByPk(req.body.id);
                if (!category) {
                    failWithReason(res, GetKnowledgeCategoryContentFail.NOT_EXISTS);
                    return;
                }

                succeed(res, {
                    data: {
                        name: category.name,
                        description: category.description,
                    },
                });
            } catch (e) {
                failWithReason(res, GetKnowledgeCategoryContentFail.UNKNOWN);
            }
        },
    );
