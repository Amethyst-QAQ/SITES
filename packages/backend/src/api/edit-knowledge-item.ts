import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    EditKnowledgeItemFail,
    type EditKnowledgeItemReq,
    type EditKnowledgeItemRes,
} from 'types/api/edit-knowledge-item';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { KnowledgeItem } from '../db/models/KnowledgeItem';

export const handleEditKnowledgeItemApi = (app: Express) =>
    createApi<EditKnowledgeItemReq, EditKnowledgeItemRes>(app, '/edit-knowledge-item', async (req, res) => {
        try {
            const user = await needAdmin(req, res, EditKnowledgeItemFail);
            if (!user) {
                return;
            }

            const item = await KnowledgeItem.findByPk(req.body.id);
            if (!item) {
                failWithReason(res, EditKnowledgeItemFail.NOT_EXISTS);
                return;
            }

            if (req.body.title) {
                item.title = req.body.title;
            }
            if (req.body.content) {
                item.content = req.body.content;
            }

            await item.save();
            succeed(res);
        } catch (e) {
            failWithReason(res, EditKnowledgeItemFail.UNKNOWN);
        }
    });
