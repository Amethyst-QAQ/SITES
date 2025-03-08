import type { Express } from 'express';
import { createApi } from '../create-api';
import { CreateKnowledgeFail, type CreateKnowledgeReq, type CreateKnowledgeRes } from 'types/api/create-knowledge';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';
import { Knowledge } from '../db/models/Knowledge';

export const handleCreateKnowledgeApi = (app: Express) =>
    createApi<CreateKnowledgeReq, CreateKnowledgeRes>(app, '/create-knowledge', async (req, res) => {
        try {
            const user = await needAdmin(req, res, CreateKnowledgeFail);
            if (!user) {
                return;
            }

            const category = await KnowledgeCategory.findByPk(req.body.categoryId);
            if (!category) {
                failWithReason(res, CreateKnowledgeFail.NOT_EXISTS);
                return;
            }

            const knowledge = await Knowledge.create({
                title: req.body.title,
                importance: req.body.importance,
                categoryId: category.id,
            });

            succeed(res, { id: knowledge.id });
        } catch (e) {
            failWithReason(res, CreateKnowledgeFail.UNKNOWN);
        }
    });
