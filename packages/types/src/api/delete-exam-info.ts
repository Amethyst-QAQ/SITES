export type DeleteExamInfoReq = {
    token: string;
    ids: number[];
};

export enum DeleteExamInfoFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    UNKNOWN,
}

export type DeleteExamInfoRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: DeleteExamInfoFail;
      };

export const reqType = 'DeleteExamInfoReq';
export const resType = 'DeleteExamInfoRes';
export const apiPath = 'delete-exam-info';
