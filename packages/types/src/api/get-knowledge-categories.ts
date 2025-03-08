export type GetKnowledgeCategoriesReq = {
    from: number;
    count: number;
};

export type KnowledgeCategoryInList = {
    id: number;
    name: string;
};

export type GetKnowledgeCategoriesRes =
    | {
          success: true;
          data: KnowledgeCategoryInList[];
      }
    | {
          success: false;
      };

export const reqType = 'GetKnowledgeCategoriesReq';
export const resType = 'GetKnowledgeCategoriesRes';
export const apiPath = 'get-knowledge-categories';
