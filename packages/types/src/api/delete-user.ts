export type DeleteUserReq = {
    token: string;
    userId: number;
};

export enum DeleteUserFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    UNKNOWN,
}

export type DeleteUserRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: DeleteUserFail;
      };

export const reqType = 'DeleteUserReq';
export const resType = 'DeleteUserRes';
export const apiPath = 'delete-user';
