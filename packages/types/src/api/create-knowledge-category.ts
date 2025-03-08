export type CreateKnowledgeCategoryReq = {
    token: string;
    name: string;
    description: string;
};

export enum CreateKnowledgeCategoryFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    UNKNOWN,
}

export type CreateKnowledgeCategoryRes =
    | {
          success: true;
          id: number;
      }
    | {
          success: false;
          reason: CreateKnowledgeCategoryFail;
      };

export const reqType = 'CreateKnowledgeCategoryReq';
export const resType = 'CreateKnowledgeCategoryRes';
export const apiPath = 'create-knowledge-category';
