import type { Express } from 'express';
import { createApi } from '../create-api';
import type { LogoutReq, LogoutRes } from 'types/api/logout';
import { logout } from '../user/user-list';

export const handleLogoutApi = (app: Express) =>
    createApi<LogoutReq, LogoutRes>(app, '/logout', (req, res) => {
        logout(req.body.token);
        res.send({ success: true });
    });
