import type { Express } from 'express';
import { createApi } from '../create-api';
import type { GetItemLearnInfoReq, GetItemLearnInfoRes } from 'types/api/get-item-learn-info';
import { failWithReason, succeed } from '../utils/send-res';
import { GetCategoryLearnInfoFail } from 'types/api/get-category-learn-info';
import { needLogin } from '../utils/need-login';
import { KnowledgeItem } from '../db/models/KnowledgeItem';
import { LearnRecord } from '../db/models/LearnRecord';

export const handleGetItemLearnInfoApi = (app: Express) =>
    createApi<GetItemLearnInfoReq, GetItemLearnInfoRes>(app, '/get-item-learn-info', async (req, res) => {
        try {
            const user = await needLogin(req, res, GetCategoryLearnInfoFail);
            if (!user) {
                return;
            }

            const item = await KnowledgeItem.findByPk(req.body.id);
            if (!item) {
                failWithReason(res, GetCategoryLearnInfoFail.NOT_EXISTS);
                return;
            }

            const record = await LearnRecord.count({
                where: {
                    knowledgeItemId: req.body.id,
                    userId: user.id,
                },
            });

            succeed(res, { learned: record > 0 });
        } catch (e) {
            failWithReason(res, GetCategoryLearnInfoFail.UNKNOWN);
        }
    });
