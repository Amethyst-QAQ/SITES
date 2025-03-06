import type { Express } from 'express';
import { createApi } from '../create-api';
import { FailReason, type LoginReq, type LoginRes } from 'types/api/login';
import { login, LoginError } from '../user/user-list';

export const handleLoginApi = (app: Express) =>
    createApi<LoginReq, LoginRes>(app, '/login', async (req, res) => {
        try {
            const token = await login(req.body.username, req.body.password);
            res.send({ success: true, token });
        } catch (e) {
            if (e instanceof LoginError) {
                res.send({ success: false, reason: e.reason });
            } else {
                res.send({ success: false, reason: FailReason.UNKNOWN });
            }
        }
    });
