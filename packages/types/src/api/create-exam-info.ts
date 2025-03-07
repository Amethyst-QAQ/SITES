export type CreateExamInfoReq = {
    token: string;
    categoryId: number;
    title: string;
    content: string;
};

export enum CreateExamInfoFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    CATEGORY_NOT_EXISTS,
    UNKNOWN,
}

export type CreateExamInfoRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: CreateExamInfoFail;
      };

export const reqType = 'CreateExamInfoReq';
export const resType = 'CreateExamInfoRes';
export const apiPath = 'create-exam-info';
