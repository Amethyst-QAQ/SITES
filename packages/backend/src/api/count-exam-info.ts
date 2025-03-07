import type { Express } from 'express';
import { createApi } from '../create-api';
import { CountExamInfoFail, type CountExamInfoReq, type CountExamInfoRes } from 'types/api/count-exam-info';
import { failWithReason, succeed } from '../utils/send-res';
import { ExamInfoCategory } from '../db/models/ExamInfoCategory';
import { ExamInfo } from '../db/models/ExamInfo';

export const handleCountExamInfoApi = (app: Express) =>
    createApi<CountExamInfoReq, CountExamInfoRes>(app, '/count-exam-info', async (req, res) => {
        try {
            const category = await ExamInfoCategory.findByPk(req.body.categoryId);
            if (!category) {
                failWithReason(res, CountExamInfoFail.CATEGORY_NOT_EXISTS);
                return;
            }

            const count = await ExamInfo.count({ where: { categoryId: category.id } });
            succeed(res, { count });
        } catch (e) {
            failWithReason(res, CountExamInfoFail.UNKNOWN);
        }
    });
