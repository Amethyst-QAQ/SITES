export type CountKnowledgeReq = {
    categoryId: number;
};

export enum CountKnowledgeFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type CountKnowledgeRes =
    | {
          success: true;
          count: number;
      }
    | {
          success: false;
          reason: CountKnowledgeFail;
      };

export const reqType = 'CountKnowledgeReq';
export const resType = 'CountKnowledgeRes';
export const apiPath = 'count-knowledge';
