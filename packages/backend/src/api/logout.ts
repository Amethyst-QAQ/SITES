import type { Express } from 'express';
import { createApi } from '../create-api';
import type { LogoutReq, LogoutRes } from 'types/api/logout';
import { logout } from '../user/user-list';
import { fail, succeed } from '../utils/send-res';

export const handleLogoutApi = (app: Express) =>
    createApi<LogoutReq, LogoutRes>(app, '/logout', (req, res) => {
        try {
            logout(req.body.token);
            succeed(res);
        } catch (e) {
            fail(res);
        }
    });
