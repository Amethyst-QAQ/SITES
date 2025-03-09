import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetLastLearnRecordFail,
    type GetLastLearnRecordReq,
    type GetLastLearnRecordRes,
} from 'types/api/get-last-learn-record';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { LearnRecord } from '../db/models/LearnRecord';

export const handleGetLastLearnRecordApi = (app: Express) =>
    createApi<GetLastLearnRecordReq, GetLastLearnRecordRes>(app, '/get-last-learn-record', async (req, res) => {
        try {
            const user = await needLogin(req, res, GetLastLearnRecordFail);
            if (!user) {
                return;
            }

            const record = await LearnRecord.findOne({
                where: { userId: user.id },
                order: [['date', 'DESC']],
            });

            succeed(res, { data: record ? { id: record.knowledgeItemId, date: record.date.getTime() } : undefined });
        } catch (e) {
            failWithReason(res, GetLastLearnRecordFail.UNKNOWN);
        }
    });
