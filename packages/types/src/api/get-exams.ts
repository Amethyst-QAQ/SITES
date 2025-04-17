export type GetExamsReq = {
    token: string;
    from: number;
    count: number;
};

export enum GetExamsFail {
    NOT_LOGGED_IN,
    UNKNOWN,
}

export type ExamInList = {
    token: string;
    date: number;
};

export type GetExamsRes =
    | {
          success: true;
          data: ExamInList[];
      }
    | {
          success: false;
          reason: GetExamsFail;
      };

export const reqType = 'GetExamsReq';
export const resType = 'GetExamsRes';
export const apiPath = 'get-exams';
