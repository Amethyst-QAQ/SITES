import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    CreateKnowledgeCategoryFail,
    type CreateKnowledgeCategoryReq,
    type CreateKnowledgeCategoryRes,
} from 'types/api/create-knowledge-category';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';

export const handleCreateKnowledgeCategoryApi = (app: Express) =>
    createApi<CreateKnowledgeCategoryReq, CreateKnowledgeCategoryRes>(
        app,
        '/create-knowledge-category',
        async (req, res) => {
            try {
                const user = await needAdmin(req, res, CreateKnowledgeCategoryFail);
                if (!user) {
                    return;
                }

                const category = await KnowledgeCategory.create({
                    name: req.body.name,
                    description: req.body.description,
                });
                succeed(res, { id: category.id });
            } catch (e) {
                failWithReason(res, CreateKnowledgeCategoryFail.UNKNOWN);
            }
        },
    );
