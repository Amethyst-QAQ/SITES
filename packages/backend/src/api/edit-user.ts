import type { Express } from 'express';
import { createApi } from '../create-api';
import { EditUserFail, type EditUserReq, type EditUserRes } from 'types/api/edit-user';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';

export const handleEditUserApi = (app: Express) =>
    createApi<EditUserReq, EditUserRes>(app, '/edit-user', async (req, res) => {
        try {
            const user = await needLogin(req, res, EditUserFail);
            if (!user) {
                return;
            }
            if (req.body.avatarId) {
                user.avatarId = req.body.avatarId;
            }
            if (req.body.description) {
                user.description = req.body.description;
            }
            if (req.body.nickname) {
                user.nickname = req.body.nickname;
            }
            await user.save();
            succeed(res);
        } catch (e) {
            failWithReason(res, EditUserFail.UNKNOWN);
        }
    });
