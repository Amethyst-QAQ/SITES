export type DeleteKnowledgeReq = {
    token: string;
    ids: number[];
};

export enum DeleteKnowledgeFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    UNKNOWN,
}

export type DeleteKnowledgeRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: DeleteKnowledgeFail;
      };

export const reqType = 'DeleteKnowledgeReq';
export const resType = 'DeleteKnowledgeRes';
export const apiPath = 'delete-knowledge';
