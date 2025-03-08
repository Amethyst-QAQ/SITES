export type GetKnowledgeItemContentReq = {
    id: number;
};

export type KnowledgeItemContent = {
    title: string;
    content: string;
};

export enum GetKnowledgeItemContentFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type GetKnowledgeItemContentRes =
    | {
          success: true;
          data: KnowledgeItemContent;
      }
    | {
          success: false;
          reason: GetKnowledgeItemContentFail;
      };

export const reqType = 'GetKnowledgeItemContentReq';
export const resType = 'GetKnowledgeItemContentRes';
export const apiPath = 'get-knowledge-item-content';
