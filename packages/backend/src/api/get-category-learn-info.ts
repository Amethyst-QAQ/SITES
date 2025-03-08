import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetCategoryLearnInfoFail,
    type GetCategoryLearnInfoReq,
    type GetCategoryLearnInfoRes,
} from 'types/api/get-category-learn-info';
import { needLogin } from '../utils/need-login';
import { KnowledgeCategory } from '../db/models/KnowledgeCategory';
import { failWithReason, succeed } from '../utils/send-res';
import { Knowledge } from '../db/models/Knowledge';

export const handleGetCategoryLearnInfoApi = (app: Express) =>
    createApi<GetCategoryLearnInfoReq, GetCategoryLearnInfoRes>(app, '/get-category-learn-info', async (req, res) => {
        try {
            const user = await needLogin(req, res, GetCategoryLearnInfoFail);
            if (!user) {
                return;
            }

            const category = await KnowledgeCategory.findByPk(req.body.id);
            if (!category) {
                failWithReason(res, GetCategoryLearnInfoFail.NOT_EXISTS);
                return;
            }

            const [totalCount, learnedCount] = await Promise.all([
                Knowledge.count({
                    where: {
                        categoryId: category.id,
                    },
                    include: ['items'],
                }),
                Knowledge.count({
                    where: {
                        categoryId: category.id,
                    },
                    include: {
                        association: 'items',
                        include: {
                            association: 'learnRecords',
                            required: true,
                            include: {
                                association: 'user',
                                where: { id: user.id },
                            },
                        },
                    },
                }),
            ]);

            succeed(res, { learned: learnedCount, total: totalCount });
        } catch (e) {
            failWithReason(res, GetCategoryLearnInfoFail.UNKNOWN);
        }
    });
