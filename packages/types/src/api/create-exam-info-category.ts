export type CreateExamInfoCategoryReq = {
    token: string;
    name: string;
};

export enum CreateExamInfoCategoryFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    UNKNOWN,
}

export type CreateExamInfoCategoryRes =
    | {
          success: true;
          id: number;
      }
    | {
          success: false;
          reason: CreateExamInfoCategoryFail;
      };

export const reqType = 'CreateExamInfoCategoryReq';
export const resType = 'CreateExamInfoCategoryRes';
export const apiPath = 'create-exam-info-category';
