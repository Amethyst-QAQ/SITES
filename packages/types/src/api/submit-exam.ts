export type SubmitExamReq = {
    token: string;
    examToken: string;
    answers: (number | string)[];
};

export enum SubmitExamFail {
    NOT_LOGGED_IN,
    WRONG_DATA,
    UNKNOWN,
}

export type SubmitExamRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: SubmitExamFail;
      };

export const reqType = 'SubmitExamReq';
export const resType = 'SubmitExamRes';
export const apiPath = 'submit-exam';
