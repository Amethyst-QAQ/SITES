export type EditKnowledgeItemReq = {
    token: string;
    id: number;
    title?: string;
    content?: string;
};

export enum EditKnowledgeItemFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    NOT_EXISTS,
    UNKNOWN,
}

export type EditKnowledgeItemRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: EditKnowledgeItemFail;
      };

export const reqType = 'EditKnowledgeItemReq';
export const resType = 'EditKnowledgeItemRes';
export const apiPath = 'edit-knowledge-item';
