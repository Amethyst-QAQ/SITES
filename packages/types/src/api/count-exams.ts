export type CountExamsReq = {
    token: string;
};

export enum CountExamsFail {
    NOT_LOGGED_IN,
    UNKNOWN,
}

export type CountExamsRes =
    | {
          success: true;
          count: number;
      }
    | {
          success: false;
          reason: CountExamsFail;
      };

export const reqType = 'CountExamsReq';
export const resType = 'CountExamsRes';
export const apiPath = 'count-exams';
