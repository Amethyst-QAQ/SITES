import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetExamInfoContentFail,
    type GetExamInfoContentReq,
    type GetExamInfoContentRes,
} from 'types/api/get-exam-info-content';
import { failWithReason, succeed } from '../utils/send-res';
import { ExamInfo } from '../db/models/ExamInfo';

export const handleGetExamInfoContentApi = (app: Express) =>
    createApi<GetExamInfoContentReq, GetExamInfoContentRes>(app, '/get-exam-info-content', async (req, res) => {
        try {
            const info = await ExamInfo.findByPk(req.body.id);
            if (!info) {
                failWithReason(res, GetExamInfoContentFail.NOT_EXISTS);
                return;
            }

            succeed(res, {
                data: {
                    title: info.title,
                    content: info.content,
                    createdAt: info.createdAt.getTime(),
                    updatedAt: info.updatedAt.getTime(),
                },
            });
        } catch (e) {
            failWithReason(res, GetExamInfoContentFail.UNKNOWN);
        }
    });
