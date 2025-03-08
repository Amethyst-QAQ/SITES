import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetKnowledgeItemsFail,
    type GetKnowledgeItemsReq,
    type GetKnowledgeItemsRes,
} from 'types/api/get-knowledge-items';
import { failWithReason, succeed } from '../utils/send-res';
import { Knowledge } from '../db/models/Knowledge';
import { KnowledgeItem } from '../db/models/KnowledgeItem';

export const handleGetKnowledgeItemsApi = (app: Express) =>
    createApi<GetKnowledgeItemsReq, GetKnowledgeItemsRes>(app, '/get-knowledge-items', async (req, res) => {
        try {
            const knowledge = await Knowledge.findByPk(req.body.knowledgeId);
            if (!knowledge) {
                failWithReason(res, GetKnowledgeItemsFail.NOT_EXISTS);
                return;
            }

            const items = await KnowledgeItem.findAll({ where: { knowledgeId: knowledge.id } });
            succeed(res, {
                data: items.map((i) => ({
                    id: i.id,
                    title: i.title,
                })),
            });
        } catch (e) {
            failWithReason(res, GetKnowledgeItemsFail.UNKNOWN);
        }
    });
