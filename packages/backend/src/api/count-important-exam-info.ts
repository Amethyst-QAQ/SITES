import type { Express } from 'express';
import { createApi } from '../create-api';
import type { CountImportantExamInfoReq, CountImportantExamInfoRes } from 'types/api/count-important-exam-info';
import { fail, succeed } from '../utils/send-res';
import { ExamInfo } from '../db/models/ExamInfo';

export const handleCountImportantExamInfoApi = (app: Express) =>
    createApi<CountImportantExamInfoReq, CountImportantExamInfoRes>(
        app,
        '/count-important-exam-info',
        async (_req, res) => {
            try {
                const count = await ExamInfo.count({ where: { isImportant: true } });
                succeed(res, { count });
            } catch (e) {
                fail(res);
            }
        },
    );
