import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    CreateKnowledgeItemFail,
    type CreateKnowledgeItemReq,
    type CreateKnowledgeItemRes,
} from 'types/api/create-knowledge-item';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { Knowledge } from '../db/models/Knowledge';
import { KnowledgeItem } from '../db/models/KnowledgeItem';

export const handleCreateKnowledgeItemApi = (app: Express) =>
    createApi<CreateKnowledgeItemReq, CreateKnowledgeItemRes>(app, '/create-knowledge-item', async (req, res) => {
        try {
            const user = await needAdmin(req, res, CreateKnowledgeItemFail);
            if (!user) {
                return;
            }

            const knowledge = await Knowledge.findByPk(req.body.knowledgeId);
            if (!knowledge) {
                failWithReason(res, CreateKnowledgeItemFail.NOT_EXISTS);
                return;
            }

            const knowledgeItem = await KnowledgeItem.create({
                title: req.body.title,
                content: req.body.content,
                knowledgeId: knowledge.id,
            });

            succeed(res, { id: knowledgeItem.id });
        } catch (e) {
            failWithReason(res, CreateKnowledgeItemFail.UNKNOWN);
        }
    });
