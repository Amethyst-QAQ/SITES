export type GetExamInfoContentReq = {
    id: number;
};

export enum GetExamInfoContentFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type ExamInfoContent = {
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
};

export type GetExamInfoContentRes =
    | {
          success: true;
          data: ExamInfoContent;
      }
    | {
          success: false;
          reason: GetExamInfoContentFail;
      };

export const reqType = 'GetExamInfoContentReq';
export const resType = 'GetExamInfoContentRes';
export const apiPath = 'get-exam-info-content';
