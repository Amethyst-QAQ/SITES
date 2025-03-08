export type DeleteKnowledgeItemsReq = {
    token: string;
    ids: number[];
};

export enum DeleteKnowledgeItemsFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    UNKNOWN,
}

export type DeleteKnowledgeItemsRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: DeleteKnowledgeItemsFail;
      };

export const reqType = 'DeleteKnowledgeItemsReq';
export const resType = 'DeleteKnowledgeItemsRes';
export const apiPath = 'delete-knowledge-items';
