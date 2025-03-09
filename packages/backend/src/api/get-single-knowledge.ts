import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetSingleKnowledgeFail,
    type GetSingleKnowledgeReq,
    type GetSingleKnowledgeRes,
} from 'types/api/get-single-knowledge';
import { failWithReason, succeed } from '../utils/send-res';
import { Knowledge } from '../db/models/Knowledge';

export const handleGetSingleKnowledgeApi = (app: Express) =>
    createApi<GetSingleKnowledgeReq, GetSingleKnowledgeRes>(app, '/get-single-knowledge', async (req, res) => {
        try {
            const knowledge = await Knowledge.findByPk(req.body.id);
            if (!knowledge) {
                failWithReason(res, GetSingleKnowledgeFail.NOT_EXISTS);
                return;
            }
            succeed(res, { title: knowledge.title, importance: knowledge.importance });
        } catch (e) {
            failWithReason(res, GetSingleKnowledgeFail.UNKNOWN);
        }
    });
