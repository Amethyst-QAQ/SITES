import type { Express } from 'express';
import { createApi } from '../create-api';
import { StartLearningFail, type StartLearningReq, type StartLearningRes } from 'types/api/start-learning';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { createTimeToken } from '../user/user-list';

export const handleStartLearningApi = (app: Express) =>
    createApi<StartLearningReq, StartLearningRes>(app, '/start-learning', async (req, res) => {
        try {
            const user = await needLogin(req, res, StartLearningFail);
            if (!user) {
                return;
            }

            const timeToken = createTimeToken(req.body.token);
            if (!timeToken) {
                failWithReason(res, StartLearningFail.UNKNOWN);
                return;
            }

            succeed(res, { timeToken });
        } catch (e) {
            failWithReason(res, StartLearningFail.UNKNOWN);
        }
    });
