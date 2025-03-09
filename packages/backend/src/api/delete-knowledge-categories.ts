import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    DeleteKnowledgeCategoriesFail,
    type DeleteKnowledgeCategoriesReq,
    type DeleteKnowledgeCategoriesRes,
} from 'types/api/delete-knowledge-categories';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';
import { Knowledge } from '../db/models/Knowledge';
import { KnowledgeItem } from '../db/models/KnowledgeItem';
import { Op } from '@sequelize/core';

export const handleDeleteKnowledgeCategoriesApi = (app: Express) =>
    createApi<DeleteKnowledgeCategoriesReq, DeleteKnowledgeCategoriesRes>(
        app,
        '/delete-knowledge-categories',
        async (req, res) => {
            try {
                const user = await needAdmin(req, res, DeleteKnowledgeCategoriesFail);
                if (!user) {
                    return;
                }

                const knowledge = await Knowledge.findAll({
                    where: { categoryId: { [Op.in]: req.body.ids } },
                });

                if (knowledge.length > 0) {
                    const knowledgeIds = knowledge.map((knowledge) => knowledge.id);

                    await KnowledgeItem.destroy({
                        where: { knowledgeId: { [Op.in]: knowledgeIds } },
                    });

                    await Knowledge.destroy({
                        where: { id: { [Op.in]: knowledgeIds } },
                    });
                }

                await KnowledgeCategory.destroy({ where: { id: { [Op.in]: req.body.ids } } });
                succeed(res);
            } catch (e) {
                failWithReason(res, DeleteKnowledgeCategoriesFail.UNKNOWN);
            }
        },
    );
