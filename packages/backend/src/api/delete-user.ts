import type { Express } from 'express';
import { createApi } from '../create-api';
import { DeleteUserFail, type DeleteUserReq, type DeleteUserRes } from 'types/api/delete-user';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { User } from '../db/models/User';

export const handleDeleteUserApi = (app: Express) =>
    createApi<DeleteUserReq, DeleteUserRes>(app, '/delete-user', async (req, res) => {
        try {
            const admin = await needAdmin(req, res, DeleteUserFail);
            if (!admin) {
                return;
            }
            await User.destroy({ where: { id: req.body.userId } });
            succeed(res);
        } catch (e) {
            failWithReason(res, DeleteUserFail.UNKNOWN);
        }
    });
