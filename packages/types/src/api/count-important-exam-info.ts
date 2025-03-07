export type CountImportantExamInfoReq = object;
export type CountImportantExamInfoRes =
    | {
          success: true;
          count: number;
      }
    | {
          success: false;
      };

export const reqType = 'CountImportantExamInfoReq';
export const resType = 'CountImportantExamInfoRes';
export const apiPath = 'count-important-exam-info';
