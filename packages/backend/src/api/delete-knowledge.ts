import type { Express } from 'express';
import { createApi } from '../create-api';
import { DeleteKnowledgeFail, type DeleteKnowledgeReq, type DeleteKnowledgeRes } from 'types/api/delete-knowledge';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { Knowledge } from '../db/models/Knowledge';
import { Op } from '@sequelize/core';

export const handleDeleteKnowledgeApi = (app: Express) =>
    createApi<DeleteKnowledgeReq, DeleteKnowledgeRes>(app, '/delete-knowledge', async (req, res) => {
        try {
            const user = await needAdmin(req, res, DeleteKnowledgeFail);
            if (!user) {
                return;
            }

            await Knowledge.destroy({ where: { id: { [Op.in]: req.body.ids } } });
            succeed(res);
        } catch (e) {
            failWithReason(res, DeleteKnowledgeFail.UNKNOWN);
        }
    });
