export type EditExamInfoCategoryReq = {
    token: string;
    id: number;
    name: string;
};

export enum EditExamInfoCategoryFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    NOT_EXISTS,
    UNKNOWN,
}

export type EditExamInfoCategoryRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: EditExamInfoCategoryFail;
      };

export const reqType = 'EditExamInfoCategoryReq';
export const resType = 'EditExamInfoCategoryRes';
export const apiPath = 'edit-exam-info-category';
