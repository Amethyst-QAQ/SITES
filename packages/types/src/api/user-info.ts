import type { PermissionLevel } from '../lib/permission-level';

export type UserInfoReq = {
    id: number;
};

export enum UserInfoFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type UserInfo = {
    username: string;
    nickname: string;
    avatarId: number;
    description: string;
    permissionLevel: PermissionLevel;
};

export type UserInfoRes =
    | {
          success: true;
          data: UserInfo;
      }
    | {
          success: false;
          reason: UserInfoFail;
      };

export const reqType = 'UserInfoReq';
export const resType = 'UserInfoRes';
export const apiPath = 'user-info';
