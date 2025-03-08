export type CreateKnowledgeReq = {
    token: string;
    categoryId: number;
    title: string;
    importance: number;
};

export enum CreateKnowledgeFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    NOT_EXISTS,
    UNKNOWN,
}

export type CreateKnowledgeRes =
    | {
          success: true;
          id: number;
      }
    | {
          success: false;
          reason: CreateKnowledgeFail;
      };

export const reqType = 'CreateKnowledgeReq';
export const resType = 'CreateKnowledgeRes';
export const apiPath = 'create-knowledge';
