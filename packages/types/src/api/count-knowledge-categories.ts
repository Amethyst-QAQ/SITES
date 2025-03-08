export type CountKnowledgeCategoriesReq = object;

export type CountKnowledgeCategoriesRes =
    | {
          success: true;
          count: number;
      }
    | {
          success: false;
      };

export const reqType = 'CountKnowledgeCategoriesReq';
export const resType = 'CountKnowledgeCategoriesRes';
export const apiPath = 'count-knowledge-categories';
