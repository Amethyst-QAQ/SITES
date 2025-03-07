export type GetExamInfoCategoryReq = {
    id: number;
};

export enum GetExamInfoCategoryFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type GetExamInfoCategoryRes =
    | {
          success: true;
          name: string;
      }
    | {
          success: false;
          reason: GetExamInfoCategoryFail;
      };

export const reqType = 'GetExamInfoCategoryReq';
export const resType = 'GetExamInfoCategoryRes';
export const apiPath = 'get-exam-info-category';
