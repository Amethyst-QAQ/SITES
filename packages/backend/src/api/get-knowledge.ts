import type { Express } from 'express';
import { createApi } from '../create-api';
import { GetKnowledgeFail, type GetKnowledgeReq, type GetKnowledgeRes } from 'types/api/get-knowledge';
import { failWithReason, succeed } from '../utils/send-res';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';
import { Knowledge } from '../db/models/Knowledge';

export const handleGetKnowledgeApi = (app: Express) =>
    createApi<GetKnowledgeReq, GetKnowledgeRes>(app, '/get-knowledge', async (req, res) => {
        try {
            const category = await KnowledgeCategory.findByPk(req.body.categoryId);
            if (!category) {
                failWithReason(res, GetKnowledgeFail.NOT_EXISTS);
                return;
            }

            const knowledge = await Knowledge.findAll({
                where: { categoryId: category.id },
                offset: req.body.from,
                limit: req.body.count,
            });

            succeed(res, { data: knowledge.map((i) => ({ id: i.id, title: i.title, importance: i.importance })) });
        } catch (e) {
            failWithReason(res, GetKnowledgeFail.UNKNOWN);
        }
    });
