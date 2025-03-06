import type { Express } from 'express';
import { createApi } from '../create-api';
import { FailReason, type UserInfoReq, type UserInfoRes } from 'types/api/user-info';
import { verify } from '../user/user-list';
import { User } from '../db/models/User';

export const handleUserInfoApi = (app: Express) =>
    createApi<UserInfoReq, UserInfoRes>(app, '/user-info', async (req, res) => {
        try {
            const userId = await verify(req.body.token);
            if (!userId) {
                res.send({ success: false, reason: FailReason.NOT_LOGGED_IN });
                return;
            }

            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error();
            }

            res.send({
                success: true,
                id: userId,
                username: user.username,
                nickname: user.nickname ?? user.username,
            });
        } catch (e) {
            res.send({ success: false, reason: FailReason.UNKNOWN });
        }
    });
