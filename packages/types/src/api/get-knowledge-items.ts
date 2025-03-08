export type GetKnowledgeItemsReq = {
    knowledgeId: number;
};

export enum GetKnowledgeItemsFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type KnowledgeItemInList = {
    id: number;
    title: string;
};

export type GetKnowledgeItemsRes =
    | {
          success: true;
          data: KnowledgeItemInList[];
      }
    | {
          success: false;
          reason: GetKnowledgeItemsFail;
      };

export const reqType = 'GetKnowledgeItemsReq';
export const resType = 'GetKnowledgeItemsRes';
export const apiPath = 'get-knowledge-items';
