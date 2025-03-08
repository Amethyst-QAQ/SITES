import type { Express } from 'express';
import { createApi } from '../create-api';
import { GetLearnTimeFail, type GetLearnTimeReq, type GetLearnTimeRes } from 'types/api/get-learn-time';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { LearnTime } from '../db/models/LearnTime';
import { Op } from '@sequelize/core';
import { OldLearnTime } from '../db/models/OldLearnTime';

export const handleGetLearnTimeApi = (app: Express) =>
    createApi<GetLearnTimeReq, GetLearnTimeRes>(app, '/get-learn-time', async (req, res) => {
        try {
            const user = await needLogin(req, res, GetLearnTimeFail);
            if (!user) {
                return;
            }

            const utcOffset = req.body.utcOffset;
            if (utcOffset > 840 || utcOffset < -720) {
                failWithReason(res, GetLearnTimeFail.INVALID_UTC_OFFSET);
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayInUserTimezone = new Date(today.getTime() + utcOffset * 60 * 1000);

            const [learnTimes, oldLearnTime] = await Promise.all([
                LearnTime.findAll({
                    where: {
                        userId: user.id,
                    },
                }),
                OldLearnTime.findByPk(user.id),
            ]);

            let learnTimeToday = 0;
            let totalLearnTime = 0;
            for (const learnTime of learnTimes) {
                if (learnTime.endAt.getTime() > todayInUserTimezone.getTime()) {
                    const endSeconds = Math.floor(learnTime.endAt.getTime() / 1000);
                    let startSeconds = Math.floor(learnTime.startAt.getTime() / 1000);
                    if (startSeconds < Math.floor(todayInUserTimezone.getTime() / 1000)) {
                        startSeconds = Math.floor(todayInUserTimezone.getTime() / 1000);
                    }

                    learnTimeToday += endSeconds - startSeconds;
                }

                totalLearnTime += Math.floor((learnTime.endAt.getTime() - learnTime.startAt.getTime()) / 1000);
            }

            if (oldLearnTime) {
                totalLearnTime += oldLearnTime.time;
            }

            succeed(res, { today: learnTimeToday, total: totalLearnTime });
        } catch (e) {
            failWithReason(res, GetLearnTimeFail.UNKNOWN);
        }
    });
