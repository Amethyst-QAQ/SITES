export type GetLearnTimeReq = {
    token: string;
    utcOffset: number;
};

export enum GetLearnTimeFail {
    NOT_LOGGED_IN,
    INVALID_UTC_OFFSET,
    UNKNOWN,
}

export type GetLearnTimeRes =
    | {
          success: true;
          today: number;
          total: number;
      }
    | {
          success: false;
          reason: GetLearnTimeFail;
      };

export const reqType = 'GetLearnTimeReq';
export const resType = 'GetLearnTimeRes';
export const apiPath = 'get-learn-time';
