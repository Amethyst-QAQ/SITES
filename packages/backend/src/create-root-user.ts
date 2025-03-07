import { PermissionLevel } from 'types/lib/permission-level';
import { User } from './db/models/User';
import { MD5 } from 'crypto-js';

export const createRootUser = async () => {
    const userCount = await User.count();
    if (userCount > 0) {
        return;
    }

    const rootUser = await User.create({
        username: 'root',
        password: MD5('123456').toString(),
        permissionLevel: PermissionLevel.ROOT,
    });
    return rootUser;
};
