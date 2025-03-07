import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetExamInfoCategoryFail,
    type GetExamInfoCategoryReq,
    type GetExamInfoCategoryRes,
} from 'types/api/get-exam-info-category';
import { failWithReason, succeed } from '../utils/send-res';
import { ExamInfoCategory } from '../db/models/ExamInfoCategory';

export const handleGetExamInfoCategoryApi = (app: Express) =>
    createApi<GetExamInfoCategoryReq, GetExamInfoCategoryRes>(app, '/get-exam-info-category', async (req, res) => {
        try {
            const category = await ExamInfoCategory.findByPk(req.body.id);
            if (!category) {
                failWithReason(res, GetExamInfoCategoryFail.NOT_EXISTS);
                return;
            }
            succeed(res, { name: category.name });
        } catch (e) {
            failWithReason(res, GetExamInfoCategoryFail.UNKNOWN);
        }
    });
