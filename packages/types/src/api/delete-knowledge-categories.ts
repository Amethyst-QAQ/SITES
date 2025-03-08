export type DeleteKnowledgeCategoriesReq = {
    token: string;
    ids: number[];
};

export enum DeleteKnowledgeCategoriesFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    UNKNOWN,
}

export type DeleteKnowledgeCategoriesRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: DeleteKnowledgeCategoriesFail;
      };

export const reqType = 'DeleteKnowledgeCategoriesReq';
export const resType = 'DeleteKnowledgeCategoriesRes';
export const apiPath = 'delete-knowledge-categories';
