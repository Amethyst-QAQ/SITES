import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    EditKnowledgeCategoryFail,
    type EditKnowledgeCategoryReq,
    type EditKnowledgeCategoryRes,
} from 'types/api/edit-knowledge-category';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';

export const handleEditKnowledgeCategoryApi = (app: Express) =>
    createApi<EditKnowledgeCategoryReq, EditKnowledgeCategoryRes>(app, '/edit-knowledge-category', async (req, res) => {
        try {
            const user = await needAdmin(req, res, EditKnowledgeCategoryFail);
            if (!user) {
                return;
            }

            const id = (req.body as any).id;
            if (!id) {
                failWithReason(res, EditKnowledgeCategoryFail.NOT_EXISTS);
                return;
            }

            const category = await KnowledgeCategory.findByPk(id);
            if (!category) {
                failWithReason(res, EditKnowledgeCategoryFail.NOT_EXISTS);
                return;
            }

            if (req.body.name) {
                category.name = req.body.name;
            }
            if (req.body.description) {
                category.description = req.body.description;
            }

            await category.save();
            succeed(res);
        } catch (e) {
            failWithReason(res, EditKnowledgeCategoryFail.UNKNOWN);
        }
    });
