import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    DeleteKnowledgeItemsFail,
    type DeleteKnowledgeItemsReq,
    type DeleteKnowledgeItemsRes,
} from 'types/api/delete-knowledge-items';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { KnowledgeItem } from '../db/models/KnowledgeItem';
import { Op } from '@sequelize/core';

export const handleDeleteKnowledgeItemsApi = (app: Express) =>
    createApi<DeleteKnowledgeItemsReq, DeleteKnowledgeItemsRes>(app, '/delete-knowledge-items', async (req, res) => {
        try {
            const user = await needAdmin(req, res, DeleteKnowledgeItemsFail);
            if (!user) {
                return;
            }

            await KnowledgeItem.destroy({ where: { id: { [Op.in]: req.body.ids } } });
            succeed(res);
        } catch (e) {
            failWithReason(res, DeleteKnowledgeItemsFail.UNKNOWN);
        }
    });
