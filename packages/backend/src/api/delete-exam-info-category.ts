import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    DeleteExamInfoCategoryFail,
    type DeleteExamInfoCategoryReq,
    type DeleteExamInfoCategoryRes,
} from 'types/api/delete-exam-info-category';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { ExamInfo } from '../db/models/ExamInfo';
import { ExamInfoCategory } from '../db/models/ExamInfoCategory';

export const handleDeleteExamInfoCategoryApi = (app: Express) =>
    createApi<DeleteExamInfoCategoryReq, DeleteExamInfoCategoryRes>(
        app,
        '/delete-exam-info-category',
        async (req, res) => {
            try {
                const user = needAdmin(req, res, DeleteExamInfoCategoryFail);
                if (!user) {
                    return;
                }

                await ExamInfo.destroy({ where: { categoryId: req.body.id } });
                await ExamInfoCategory.destroy({ where: { id: req.body.id } });
                succeed(res);
            } catch (e) {
                failWithReason(res, DeleteExamInfoCategoryFail.UNKNOWN);
            }
        },
    );
