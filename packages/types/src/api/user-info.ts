export type UserInfoReq = {
    token: string;
};

export enum FailReason {
    NOT_LOGGED_IN,
    UNKNOWN,
}

export type UserInfoRes =
    | {
          success: true;
          id: number;
          username: string;
          nickname: string;
      }
    | {
          success: false;
          reason: FailReason;
      };

export const reqType = 'UserInfoReq';
export const resType = 'UserInfoRes';
export const apiPath = 'user-info';
