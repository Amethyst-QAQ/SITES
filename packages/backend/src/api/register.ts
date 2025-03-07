import type { Express } from 'express';
import { createApi } from '../create-api';
import { RegisterFail, type RegisterReq, type RegisterRes } from 'types/api/register';
import { User } from '../db/models/User';
import { failWithReason, succeed } from '../utils/send-res';

export const handleRegisterApi = (app: Express) =>
    createApi<RegisterReq, RegisterRes>(app, '/register', async (req, res) => {
        try {
            if (await User.findOne({ where: { username: req.body.username } })) {
                failWithReason(res, RegisterFail.EXISTS);
                return;
            }
            await User.create(req.body);
            succeed(res);
        } catch (e) {
            failWithReason(res, RegisterFail.UNKNOWN);
        }
    });
