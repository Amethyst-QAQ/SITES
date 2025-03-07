import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    EditExamInfoCategoryFail,
    type EditExamInfoCategoryReq,
    type EditExamInfoCategoryRes,
} from 'types/api/edit-exam-info-category';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { ExamInfoCategory } from '../db/models/ExamInfoCategory';

export const handleEditExamInfoCategoryApi = (app: Express) =>
    createApi<EditExamInfoCategoryReq, EditExamInfoCategoryRes>(app, '/edit-exam-info-category', async (req, res) => {
        try {
            const user = await needAdmin(req, res, EditExamInfoCategoryFail);
            if (!user) {
                return;
            }

            const category = await ExamInfoCategory.findByPk(req.body.id);
            if (!category) {
                failWithReason(res, EditExamInfoCategoryFail.NOT_EXISTS);
                return;
            }

            category.name = req.body.name;
            succeed(res);
        } catch (e) {
            failWithReason(res, EditExamInfoCategoryFail.UNKNOWN);
        }
    });
