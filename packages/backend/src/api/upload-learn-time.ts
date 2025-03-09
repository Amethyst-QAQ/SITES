import type { Express } from 'express';
import { createApi } from '../create-api';
import { UploadLearnTimeFail, type UploadLearnTimeReq, type UploadLearnTimeRes } from 'types/api/upload-learn-time';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { createTimeToken, verifyTimeToken } from '../user/user-list';
import { LearnTime } from '../db/models/LearnTime';
import { Op } from '@sequelize/core';
import { OldLearnTime } from '../db/models/OldLearnTime';

export const handleUploadLearnTimeApi = (app: Express) =>
    createApi<UploadLearnTimeReq, UploadLearnTimeRes>(app, '/upload-learn-time', async (req, res) => {
        try {
            const user = await needLogin(req, res, UploadLearnTimeFail);
            if (!user) {
                return;
            }

            const startDate = verifyTimeToken(req.body.token, req.body.timeToken);
            if (!startDate) {
                failWithReason(res, UploadLearnTimeFail.INVALID_DATA);
                return;
            }
            const now = new Date().getTime();

            for (const record of req.body.data) {
                const startTime = startDate.getTime() + record.from * 1000;
                if (record.to * 1000 + startTime > now) {
                    failWithReason(res, UploadLearnTimeFail.INVALID_DATA);
                    return;
                }
            }

            await LearnTime.bulkCreate(
                req.body.data.map((record) => ({
                    userId: user.id,
                    startAt: new Date(startDate.getTime() + record.from * 1000),
                    endAt: new Date(startDate.getTime() + record.to * 1000),
                })),
            );

            const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);
            const oldRecords = await LearnTime.findAll({
                where: {
                    userId: user.id,
                    startAt: {
                        [Op.lt]: threeDaysAgo,
                    },
                },
            });

            let oldTotal = 0;
            for (const record of oldRecords) {
                oldTotal += Math.floor((record.endAt.getTime() - record.startAt.getTime()) / 1000);
            }

            await LearnTime.destroy({
                where: {
                    userId: user.id,
                    startAt: {
                        [Op.lt]: threeDaysAgo,
                    },
                },
            });

            let oldTime = await OldLearnTime.findByPk(user.id);
            if (!oldTime) {
                oldTime = await OldLearnTime.create({ userId: user.id, time: 0 });
            }

            oldTime.time += oldTotal;
            await oldTime.save();

            const newTimeToken = req.body.requestNewToken ? createTimeToken(req.body.token) : '';

            succeed(res, { timeToken: newTimeToken! });
        } catch (e) {
            failWithReason(res, UploadLearnTimeFail.UNKNOWN);
        }
    });
