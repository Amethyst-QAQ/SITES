import type { Express } from 'express';
import { createApi } from '../create-api';
import { UserInfoFail, type UserInfoReq, type UserInfoRes } from 'types/api/user-info';
import { failWithReason, succeed } from '../utils/send-res';
import { User } from '../db/models/User';

export const handleUserInfoApi = (app: Express) =>
    createApi<UserInfoReq, UserInfoRes>(app, '/user-info', async (req, res) => {
        try {
            const user = await User.findByPk(req.body.id);
            if (!user) {
                failWithReason(res, UserInfoFail.NOT_EXISTS);
                return;
            }

            succeed(res, {
                data: {
                    username: user.username,
                    nickname: user.nickname ?? user.username,
                    description: user.description ?? '',
                    avatarId: user.avatarId ?? 0,
                    permissionLevel: user.permissionLevel,
                },
            });
        } catch (e) {
            failWithReason(res, UserInfoFail.UNKNOWN);
        }
    });
