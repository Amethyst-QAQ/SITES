export type EditKnowledgeReq = {
    token: string;
    id: number;
    title?: string;
    importance?: number;
};

export enum EditKnowledgeFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    NOT_EXISTS,
    UNKNOWN,
}

export type EditKnowledgeRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: EditKnowledgeFail;
      };

export const reqType = 'EditKnowledgeReq';
export const resType = 'EditKnowledgeRes';
export const apiPath = 'edit-knowledge';
