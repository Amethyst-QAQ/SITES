import type { Express } from 'express';
import { createApi } from '../create-api';
import type { GetImportantExamInfoReq, GetImportantExamInfoRes } from 'types/api/get-important-exam-info';
import { fail, succeed } from '../utils/send-res';
import { ExamInfo } from '../db/models/ExamInfo';

export const handleGetImportantExamInfoApi = (app: Express) =>
    createApi<GetImportantExamInfoReq, GetImportantExamInfoRes>(app, '/get-important-exam-info', async (req, res) => {
        try {
            const info = await ExamInfo.findAll({
                where: { isImportant: true },
                order: [['updatedAt', 'DESC']],
                offset: req.body.from,
                limit: req.body.count,
            });
            succeed(res, {
                data: info.map((i) => ({
                    id: i.id,
                    title: i.title,
                    createdAt: i.createdAt.getTime(),
                    updatedAt: i.updatedAt.getTime(),
                    isImportant: i.isImportant,
                })),
            });
        } catch (e) {
            fail(res);
        }
    });
