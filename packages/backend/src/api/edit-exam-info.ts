import type { Express } from 'express';
import { createApi } from '../create-api';
import { EditExamInfoFail, type EditExamInfoReq, type EditExamInfoRes } from 'types/api/edit-exam-info';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { ExamInfo } from '../db/models/ExamInfo';

export const handleEditExamInfoApi = (app: Express) =>
    createApi<EditExamInfoReq, EditExamInfoRes>(app, '/edit-exam-info', async (req, res) => {
        try {
            const user = await needAdmin(req, res, EditExamInfoFail);
            if (!user) {
                return;
            }

            const info = await ExamInfo.findByPk(req.body.id);
            if (!info) {
                failWithReason(res, EditExamInfoFail.NOT_EXISTS);
                return;
            }

            if (req.body.title) {
                info.title = req.body.title;
            }
            if (req.body.content) {
                info.content = req.body.content;
            }

            await info.save();
            succeed(res);
        } catch (e) {
            failWithReason(res, EditExamInfoFail.UNKNOWN);
        }
    });
