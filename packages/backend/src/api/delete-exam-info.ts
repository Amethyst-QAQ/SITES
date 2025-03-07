import type { Express } from 'express';
import { createApi } from '../create-api';
import { DeleteExamInfoFail, type DeleteExamInfoReq, type DeleteExamInfoRes } from 'types/api/delete-exam-info';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { ExamInfo } from '../db/models/ExamInfo';
import { Op } from '@sequelize/core';

export const handleDeleteExamInfoApi = (app: Express) =>
    createApi<DeleteExamInfoReq, DeleteExamInfoRes>(app, '/delete-exam-info', async (req, res) => {
        try {
            const user = await needAdmin(req, res, DeleteExamInfoFail);
            if (!user) {
                return;
            }

            await ExamInfo.destroy({ where: { id: { [Op.in]: req.body.ids } } });
            succeed(res);
        } catch (e) {
            failWithReason(res, DeleteExamInfoFail.UNKNOWN);
        }
    });
