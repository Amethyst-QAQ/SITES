import type { Express } from 'express';
import { createJsonApi } from '../../create-json-api';
import { FailReason, type RegisterReq, type RegisterRes } from 'types/api/json/register';
import { User } from '../../db/models/User';

export const handleRegisterApi = (app: Express) =>
    createJsonApi<RegisterReq, RegisterRes>(app, '/register', async (req, res) => {
        try {
            if (await User.findOne({ where: { username: req.body.username } })) {
                res.send({ success: false, reason: FailReason.EXISTS });
                return;
            }
            const user = await User.create(req.body);
            res.send({ success: true });
        } catch (e) {
            res.send({ success: false, reason: FailReason.UNKNOWN });
        }
    });
