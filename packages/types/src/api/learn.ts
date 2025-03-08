export type LearnReq = {
    token: string;
    id: number;
};

export enum LearnFail {
    NOT_LOGGED_IN,
    NOT_EXISTS,
    UNKNOWN,
}

export type LearnRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: LearnFail;
      };

export const reqType = 'LearnReq';
export const resType = 'LearnRes';
export const apiPath = 'learn';
