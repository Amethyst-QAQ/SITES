import type { Express } from 'express';
import { createApi } from '../create-api';
import { CreateExamInfoFail, type CreateExamInfoReq, type CreateExamInfoRes } from 'types/api/create-exam-info';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { ExamInfoCategory } from '../db/models/ExamInfoCategory';
import { ExamInfo } from '../db/models/ExamInfo';

export const handleCreateExamInfoApi = (app: Express) =>
    createApi<CreateExamInfoReq, CreateExamInfoRes>(app, '/create-exam-info', async (req, res) => {
        try {
            const user = await needAdmin(req, res, CreateExamInfoFail);
            if (!user) {
                return;
            }
            const category = await ExamInfoCategory.findByPk(req.body.categoryId);
            if (!category) {
                failWithReason(res, CreateExamInfoFail.CATEGORY_NOT_EXISTS);
                return;
            }

            await ExamInfo.create({ categoryId: category.id, title: req.body.title, content: req.body.content });
            succeed(res);
        } catch (e) {
            failWithReason(res, CreateExamInfoFail.UNKNOWN);
        }
    });
