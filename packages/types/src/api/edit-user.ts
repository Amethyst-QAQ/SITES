export type EditUserReq = {
    token: string;
    nickname?: string;
    avatarId?: number;
    description?: string;
};

export enum EditUserFail {
    NOT_LOGGED_IN,
    UNKNOWN,
}

export type EditUserRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: EditUserFail;
      };

export const reqType = 'EditUserReq';
export const resType = 'EditUserRes';
export const apiPath = 'edit-user';
