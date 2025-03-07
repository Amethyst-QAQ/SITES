import type { ExamInfoInList } from './get-exam-info';

export type GetImportantExamInfoReq = {
    from: number;
    count: number;
};

export type GetImportantExamInfoRes =
    | {
          success: true;
          data: ExamInfoInList[];
      }
    | {
          success: false;
      };

export const reqType = 'GetImportantExamInfoReq';
export const resType = 'GetImportantExamInfoRes';
export const apiPath = 'get-important-exam-info';
