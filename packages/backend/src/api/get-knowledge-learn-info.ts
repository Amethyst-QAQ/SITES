import type { Express } from 'express';
import { createApi } from '../create-api';
import type { GetKnowledgeLearnInfoReq, GetKnowledgeLearnInfoRes } from 'types/api/get-knowledge-learn-info';
import { failWithReason, succeed } from '../utils/send-res';
import { GetCategoryLearnInfoFail } from 'types/api/get-category-learn-info';
import { needLogin } from '../utils/need-login';
import { KnowledgeItem } from '../db/models/KnowledgeItem';

export const handleGetKnowledgeLearnInfoApi = (app: Express) =>
    createApi<GetKnowledgeLearnInfoReq, GetKnowledgeLearnInfoRes>(
        app,
        '/get-knowledge-learn-info',
        async (req, res) => {
            try {
                const user = await needLogin(req, res, GetCategoryLearnInfoFail);
                if (!user) {
                    return;
                }

                const [totalCount, learnedCount] = await Promise.all([
                    KnowledgeItem.count({ where: { knowledgeId: req.body.id } }),
                    KnowledgeItem.count({
                        where: { knowledgeId: req.body.id },
                        include: {
                            association: 'learnRecords',
                            required: true,
                            include: {
                                association: 'user',
                                where: { id: user.id },
                            },
                        },
                    }),
                ]);

                succeed(res, { learned: learnedCount, total: totalCount });
            } catch (e) {
                failWithReason(res, GetCategoryLearnInfoFail.UNKNOWN);
            }
        },
    );
