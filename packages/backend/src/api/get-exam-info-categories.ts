import type { Express } from 'express';
import { createApi } from '../create-api';
import type { GetExamInfoCategoriesReq, GetExamInfoCategoriesRes } from 'types/api/get-exam-info-categories';
import { fail, succeed } from '../utils/send-res';
import { ExamInfoCategory } from '../db/models/ExamInfoCategory';

export const handleGetExamInfoCategoriesApi = (app: Express) =>
    createApi<GetExamInfoCategoriesReq, GetExamInfoCategoriesRes>(
        app,
        '/get-exam-info-categories',
        async (_req, res) => {
            try {
                const categories = await ExamInfoCategory.findAll();
                succeed(res, {
                    data: categories.map((c) => ({
                        id: c.id,
                        name: c.name,
                    })),
                });
            } catch (e) {
                fail(res);
            }
        },
    );
