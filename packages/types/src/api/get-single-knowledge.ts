export type GetSingleKnowledgeReq = {
    id: number;
};

export enum GetSingleKnowledgeFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type GetSingleKnowledgeRes =
    | {
          success: true;
          title: string;
          importance: number;
      }
    | {
          success: false;
          reason: GetSingleKnowledgeFail;
      };

export const reqType = 'GetSingleKnowledgeReq';
export const resType = 'GetSingleKnowledgeRes';
export const apiPath = 'get-single-knowledge';
