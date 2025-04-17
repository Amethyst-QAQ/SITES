import type { Express } from 'express';
import { createApi } from '../create-api';
import { CountExamsFail, type CountExamsReq, type CountExamsRes } from 'types/api/count-exams';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { ExamAnswer } from '../db/models/ExamAnswer';

export const handleCountExamsApi = (app: Express) =>
    createApi<CountExamsReq, CountExamsRes>(app, '/count-exams', async (req, res) => {
        try {
            const user = await needLogin(req, res, CountExamsFail);
            if (!user) {
                return;
            }

            const count = await ExamAnswer.count({
                where: {
                    userId: user.id,
                },
            });

            succeed(res, { count });
        } catch (e) {
            failWithReason(res, CountExamsFail.UNKNOWN);
        }
    });
