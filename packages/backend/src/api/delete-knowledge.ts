import type { Express } from 'express';
import { createApi } from '../create-api';
import { DeleteKnowledgeFail, type DeleteKnowledgeReq, type DeleteKnowledgeRes } from 'types/api/delete-knowledge';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { Knowledge } from '../db/models/Knowledge';
import { Op } from '@sequelize/core';
import { KnowledgeItem } from '../db/models/KnowledgeItem';

export const handleDeleteKnowledgeApi = (app: Express) =>
    createApi<DeleteKnowledgeReq, DeleteKnowledgeRes>(app, '/delete-knowledge', async (req, res) => {
        try {
            const user = await needAdmin(req, res, DeleteKnowledgeFail);
            if (!user) {
                return;
            }

            await KnowledgeItem.destroy({ where: { knowledgeId: { [Op.in]: req.body.ids } } });
            await Knowledge.destroy({ where: { id: { [Op.in]: req.body.ids } } });
            succeed(res);
        } catch (e) {
            failWithReason(res, DeleteKnowledgeFail.UNKNOWN);
        }
    });
