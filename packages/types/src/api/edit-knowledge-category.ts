export type EditKnowledgeCategoryReq = {
    token: string;
    id: number;
    name?: string;
    description?: string;
};

export enum EditKnowledgeCategoryFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    NOT_EXISTS,
    UNKNOWN,
}

export type EditKnowledgeCategoryRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: EditKnowledgeCategoryFail;
      };

export const reqType = 'EditKnowledgeCategoryReq';
export const resType = 'EditKnowledgeCategoryRes';
export const apiPath = 'edit-knowledge-category';
