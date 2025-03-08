import type { Express } from 'express';
import { createApi } from '../create-api';
import { CountKnowledgeFail, type CountKnowledgeReq, type CountKnowledgeRes } from 'types/api/count-knowledge';
import { failWithReason, succeed } from '../utils/send-res';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';
import { Knowledge } from '../db/models/Knowledge';

export const handleCountKnowledgeApi = (app: Express) =>
    createApi<CountKnowledgeReq, CountKnowledgeRes>(app, '/count-knowledge', async (req, res) => {
        try {
            const category = await KnowledgeCategory.findByPk(req.body.categoryId);
            if (!category) {
                failWithReason(res, CountKnowledgeFail.NOT_EXISTS);
                return;
            }
            succeed(res, { count: await Knowledge.count({ where: { categoryId: req.body.categoryId } }) });
        } catch (e) {
            failWithReason(res, CountKnowledgeFail.UNKNOWN);
        }
    });
