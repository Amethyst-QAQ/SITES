export type GetTotalLearnInfoReq = {
    token: string;
};

export enum GetTotalLearnInfoFail {
    NOT_LOGGED_IN,
    UNKNOWN,
}

export type GetTotalLearnInfoRes =
    | {
          success: true;
          learned: number;
          total: number;
      }
    | {
          success: false;
          reason: GetTotalLearnInfoFail;
      };

export const reqType = 'GetTotalLearnInfoReq';
export const resType = 'GetTotalLearnInfoRes';
export const apiPath = 'get-total-learn-info';
