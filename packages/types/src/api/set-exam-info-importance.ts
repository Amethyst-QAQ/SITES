export type SetExamInfoImportanceReq = {
    token: string;
    data: {
        id: number;
        importance: boolean;
    }[];
};

export enum SetExamInfoImportanceFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    NOT_EXISTS,
    UNKNOWN,
}

export type SetExamInfoImportanceRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: SetExamInfoImportanceFail;
      };

export const reqType = 'SetExamInfoImportanceReq';
export const resType = 'SetExamInfoImportanceRes';
export const apiPath = 'set-exam-info-importance';
