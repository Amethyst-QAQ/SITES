import type { PermissionLevel } from '../lib/permission-level';

export type EditUserPermissionLevelReq = {
    token: string;
    userId: number;
    permissionLevel: PermissionLevel;
};

export enum EditUserPermissionLevelFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    NOT_EXISTS,
    UNKNOWN,
}

export type EditUserPermissionLevelRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: EditUserPermissionLevelFail;
      };

export const reqType = 'EditUserPermissionLevelReq';
export const resType = 'EditUserPermissionLevelRes';
export const apiPath = 'edit-user-permission-level';
