export type DeleteExamInfoCategoryReq = {
    token: string;
    id: number;
};

export enum DeleteExamInfoCategoryFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    UNKNOWN,
}

export type DeleteExamInfoCategoryRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: DeleteExamInfoCategoryFail;
      };

export const reqType = 'DeleteExamInfoCategoryReq';
export const resType = 'DeleteExamInfoCategoryRes';
export const apiPath = 'delete-exam-info-category';
