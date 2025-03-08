import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetTotalLearnInfoFail,
    type GetTotalLearnInfoReq,
    type GetTotalLearnInfoRes,
} from 'types/api/get-total-learn-info';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { KnowledgeItem } from '../db/models/KnowledgeItem';
import { LearnRecord } from '../db/models/LearnRecord';

export const handleGetTotalLearnInfoApi = (app: Express) =>
    createApi<GetTotalLearnInfoReq, GetTotalLearnInfoRes>(app, '/get-total-learn-info', async (req, res) => {
        try {
            const user = await needLogin(req, res, GetTotalLearnInfoFail);
            if (!user) {
                return;
            }

            const [totalCount, learnedCount] = await Promise.all([
                KnowledgeItem.count(),
                LearnRecord.count({ where: { userId: user.id } }),
            ]);

            succeed(res, { learned: learnedCount, total: totalCount });
        } catch (e) {
            failWithReason(res, GetTotalLearnInfoFail.UNKNOWN);
        }
    });
