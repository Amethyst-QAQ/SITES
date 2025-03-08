export type CreateKnowledgeItemReq = {
    token: string;
    knowledgeId: number;
    title: string;
    content: string;
};

export enum CreateKnowledgeItemFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    NOT_EXISTS,
    UNKNOWN,
}

export type CreateKnowledgeItemRes =
    | {
          success: true;
          id: number;
      }
    | {
          success: false;
          reason: CreateKnowledgeItemFail;
      };

export const reqType = 'CreateKnowledgeItemReq';
export const resType = 'CreateKnowledgeItemRes';
export const apiPath = 'create-knowledge-item';
