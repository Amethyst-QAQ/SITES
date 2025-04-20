import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    EditUserPermissionLevelFail,
    type EditUserPermissionLevelReq,
    type EditUserPermissionLevelRes,
} from 'types/api/edit-user-permission-level';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { User } from '../db/models/User';

export const handleEditUserPermissionLevelApi = (app: Express) =>
    createApi<EditUserPermissionLevelReq, EditUserPermissionLevelRes>(
        app,
        '/edit-user-permission-level',
        async (req, res) => {
            try {
                const admin = await needAdmin(req, res, EditUserPermissionLevelFail);
                if (!admin) {
                    return;
                }

                const user = await User.findByPk(req.body.userId);
                if (!user) {
                    failWithReason(res, EditUserPermissionLevelFail.NOT_EXISTS);
                    return;
                }
                user.permissionLevel = req.body.permissionLevel;
                await user.save();
                succeed(res);
            } catch (e) {
                failWithReason(res, EditUserPermissionLevelFail.UNKNOWN);
            }
        },
    );
