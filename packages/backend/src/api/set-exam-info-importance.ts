import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    SetExamInfoImportanceFail,
    type SetExamInfoImportanceReq,
    type SetExamInfoImportanceRes,
} from 'types/api/set-exam-info-importance';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { ExamInfo } from '../db/models/ExamInfo';
import { Op } from '@sequelize/core';

export const handleSetExamInfoImportanceApi = (app: Express) =>
    createApi<SetExamInfoImportanceReq, SetExamInfoImportanceRes>(
        app,
        '/set-exam-info-importance',
        async (req, res) => {
            try {
                const user = await needAdmin(req, res, SetExamInfoImportanceFail);
                if (!user) {
                    return;
                }

                const ids = req.body.data.map((i) => i.id);
                const parsed: Record<number, boolean> = {};
                for (const i of req.body.data) {
                    parsed[i.id] = i.importance;
                }

                const info = await ExamInfo.findAll({ where: { id: { [Op.in]: ids } } });
                if (info.length == 0) {
                    failWithReason(res, SetExamInfoImportanceFail.NOT_EXISTS);
                }
                await Promise.all(
                    info.map((i) =>
                        (async () => {
                            i.isImportant = parsed[i.id];
                            await i.save();
                        })(),
                    ),
                );
                succeed(res);
            } catch (e) {
                failWithReason(res, SetExamInfoImportanceFail.UNKNOWN);
            }
        },
    );
