export type GetKnowledgeCategoryContentReq = {
    id: number;
};

export type KnowledgeCategoryContent = {
    name: string;
    description: string;
};

export enum GetKnowledgeCategoryContentFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type GetKnowledgeCategoryContentRes =
    | {
          success: true;
          data: KnowledgeCategoryContent;
      }
    | {
          success: false;
          reason: GetKnowledgeCategoryContentFail;
      };

export const reqType = 'GetKnowledgeCategoryContentReq';
export const resType = 'GetKnowledgeCategoryContentRes';
export const apiPath = 'get-knowledge-category-content';
