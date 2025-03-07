export type CountExamInfoReq = {
    categoryId: number;
};

export enum CountExamInfoFail {
    CATEGORY_NOT_EXISTS,
    UNKNOWN,
}

export type CountExamInfoRes =
    | {
          success: true;
          count: number;
      }
    | {
          success: false;
          reason: CountExamInfoFail;
      };

export const reqType = 'CountExamInfoReq';
export const resType = 'CountExamInfoRes';
export const apiPath = 'count-exam-info';
