export type EditExamInfoReq = {
    token: string;
    id: number;
    title?: string;
    content?: string;
};

export enum EditExamInfoFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    NOT_EXISTS,
    UNKNOWN,
}

export type EditExamInfoRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: EditExamInfoFail;
      };

export const reqType = 'EditExamInfoReq';
export const resType = 'EditExamInfoRes';
export const apiPath = 'edit-exam-info';
