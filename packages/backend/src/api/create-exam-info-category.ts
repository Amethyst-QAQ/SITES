import type { Express } from 'express';
import { createApi } from '../create-api';
import type { CreateExamInfoCategoryReq, CreateExamInfoCategoryRes } from 'types/api/create-exam-info-category';
import { needAdmin } from '../utils/need-admin';
import { CreateExamInfoCategoryFail } from '../../../types/dist/es/api/create-exam-info-category';
import { failWithReason, succeed } from '../utils/send-res';
import { ExamInfoCategory } from '../db/models/ExamInfoCategory';

export const handleCreateExamInfoCategoryApi = (app: Express) =>
    createApi<CreateExamInfoCategoryReq, CreateExamInfoCategoryRes>(
        app,
        '/create-exam-info-category',
        async (req, res) => {
            try {
                const user = await needAdmin(req, res, CreateExamInfoCategoryFail);
                if (!user) {
                    return;
                }
                const category = await ExamInfoCategory.create({ name: req.body.name });
                if (!category) {
                    failWithReason(res, CreateExamInfoCategoryFail.UNKNOWN);
                }
                succeed(res, { id: category.id });
            } catch (e) {
                failWithReason(res, CreateExamInfoCategoryFail.UNKNOWN);
            }
        },
    );
