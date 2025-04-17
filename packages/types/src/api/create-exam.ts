export type CreateExamReq = {
    token: string;
    knowledgeId?: number;
};

export enum CreateExamFail {
    NOT_LOGGED_IN,
    NOT_EXISTS,
    NO_QUESTIONS,
    UNKNOWN,
}

export type CreateExamRes =
    | {
          success: true;
          examToken: string;
      }
    | {
          success: false;
          reason: CreateExamFail;
      };

export const reqType = 'CreateExamReq';
export const resType = 'CreateExamRes';
export const apiPath = 'create-exam';
