import type { Express } from 'express';
import { createApi } from '../create-api';
import { EditKnowledgeFail, type EditKnowledgeReq, type EditKnowledgeRes } from 'types/api/edit-knowledge';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { Knowledge } from '../db/models/Knowledge';

export const handleEditKnowledgeApi = (app: Express) =>
    createApi<EditKnowledgeReq, EditKnowledgeRes>(app, '/edit-knowledge', async (req, res) => {
        try {
            const user = await needAdmin(req, res, EditKnowledgeFail);
            if (!user) {
                return;
            }

            const knowledge = await Knowledge.findByPk(req.body.id);
            if (!knowledge) {
                failWithReason(res, EditKnowledgeFail.NOT_EXISTS);
                return;
            }

            if (req.body.title) {
                knowledge.title = req.body.title;
            }
            if (req.body.importance !== undefined) {
                knowledge.importance = req.body.importance;
            }

            await knowledge.save();
            succeed(res);
        } catch (e) {
            failWithReason(res, EditKnowledgeFail.UNKNOWN);
        }
    });
