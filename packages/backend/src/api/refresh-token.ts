import type { Express } from 'express';
import { createApi } from '../create-api';
import type { RefreshTokenReq, RefreshTokenRes } from 'types/api/refresh-token';
import { verify } from '../user/user-list';
import { fail, succeed } from '../utils/send-res';

export const handleRefreshTokenApi = (app: Express) =>
    createApi<RefreshTokenReq, RefreshTokenRes>(app, '/refresh-token', async (req, res) => {
        try {
            const user = await verify(req.body.token);
            if (!user) {
                fail(res);
                return;
            }
            succeed(res);
        } catch (e) {
            fail(res);
        }
    });
