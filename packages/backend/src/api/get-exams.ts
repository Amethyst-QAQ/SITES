import type { Express } from 'express';
import { createApi } from '../create-api';
import { GetExamsFail, type GetExamsReq, type GetExamsRes } from 'types/api/get-exams';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { ExamAnswer } from '../db/models/ExamAnswer';

export const handleGetExamsApi = (app: Express) =>
    createApi<GetExamsReq, GetExamsRes>(app, '/get-exams', async (req, res) => {
        try {
            const user = await needLogin(req, res, GetExamsFail);
            if (!user) {
                return;
            }

            const exams = await ExamAnswer.findAll({
                where: { userId: user.id },
                include: { association: 'exam' },
                order: [['id', 'DESC']],
                offset: req.body.from,
                limit: req.body.count,
            });

            succeed(res, {
                data: exams.map((e) => ({
                    token: e.exam!.token,
                    date: e.date.getTime(),
                })),
            });
        } catch (e) {
            failWithReason(res, GetExamsFail.UNKNOWN);
        }
    });
