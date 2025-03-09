export type GetLastLearnRecordReq = {
    token: string;
};

export enum GetLastLearnRecordFail {
    NOT_LOGGED_IN,
    UNKNOWN,
}

export type GetLastLearnRecordRes =
    | {
          success: true;
          data?: {
              id: number;
              date: number;
          };
      }
    | {
          success: false;
          reason: GetLastLearnRecordFail;
      };

export const reqType = 'GetLastLearnRecordReq';
export const resType = 'GetLastLearnRecordRes';
export const apiPath = 'get-last-learn-record';
