export type StartLearningReq = {
    token: string;
};

export enum StartLearningFail {
    NOT_LOGGED_IN,
    UNKNOWN,
}

export type StartLearningRes =
    | {
          success: true;
          timeToken: string;
      }
    | {
          success: false;
          reason: StartLearningFail;
      };

export const reqType = 'StartLearningReq';
export const resType = 'StartLearningRes';
export const apiPath = 'start-learning';
