import type { Express } from 'express';
import { createApi } from '../create-api';
import type { GetExamInfoReq, GetExamInfoRes } from 'types/api/get-exam-info';
import { failWithReason, succeed } from '../utils/send-res';
import { CountExamInfoFail } from 'types/api/count-exam-info';
import { ExamInfoCategory } from '../db/models/ExamInfoCategory';
import { ExamInfo } from '../db/models/ExamInfo';

export const handleGetExamInfoApi = (app: Express) =>
    createApi<GetExamInfoReq, GetExamInfoRes>(app, '/get-exam-info', async (req, res) => {
        try {
            const category = await ExamInfoCategory.findByPk(req.body.categoryId);
            if (!category) {
                failWithReason(res, CountExamInfoFail.CATEGORY_NOT_EXISTS);
                return;
            }

            const info = await ExamInfo.findAll({
                where: { categoryId: req.body.categoryId },
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
            failWithReason(res, CountExamInfoFail.UNKNOWN);
        }
    });
