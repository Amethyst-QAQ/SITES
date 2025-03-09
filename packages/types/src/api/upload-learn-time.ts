export type LearnTimeRecord = {
    from: number;
    to: number;
};

export type UploadLearnTimeReq = {
    token: string;
    requestNewToken: boolean;
    timeToken: string;
    data: LearnTimeRecord[];
};

export enum UploadLearnTimeFail {
    NOT_LOGGED_IN,
    INVALID_DATA,
    UNKNOWN,
}

export type UploadLearnTimeRes =
    | {
          success: true;
          timeToken: string;
      }
    | {
          success: false;
          reason: UploadLearnTimeFail;
      };

export const reqType = 'UploadLearnTimeReq';
export const resType = 'UploadLearnTimeRes';
export const apiPath = 'upload-learn-time';
