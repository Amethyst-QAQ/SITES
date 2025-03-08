export type GetKnowledgeReq = {
    categoryId: number;
    from: number;
    count: number;
};

export type KnowledgeInList = {
    id: number;
    title: string;
    importance: number;
};

export enum GetKnowledgeFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type GetKnowledgeRes =
    | {
          success: true;
          data: KnowledgeInList[];
      }
    | {
          success: false;
          reason: GetKnowledgeFail;
      };

export const reqType = 'GetKnowledgeReq';
export const resType = 'GetKnowledgeRes';
export const apiPath = 'get-knowledge';
