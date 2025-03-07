import type { CountExamInfoFail } from './count-exam-info';

export type GetExamInfoReq = {
    categoryId: number;
    from: number;
    count: number;
};

export type ExamInfoInList = {
    id: number;
    title: string;
    createdAt: number;
    updatedAt: number;
    isImportant: boolean;
};

export type GetExamInfoRes =
    | {
          success: true;
          data: ExamInfoInList[];
      }
    | {
          success: false;
          reason: CountExamInfoFail;
      };

export const reqType = 'GetExamInfoReq';
export const resType = 'GetExamInfoRes';
export const apiPath = 'get-exam-info';
