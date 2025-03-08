export type GetCategoryLearnInfoReq = {
    token: string;
    id: number;
};

export enum GetCategoryLearnInfoFail {
    NOT_LOGGED_IN,
    NOT_EXISTS,
    UNKNOWN,
}

export type GetCategoryLearnInfoRes =
    | {
          success: true;
          learned: number;
          total: number;
      }
    | {
          success: false;
          reason: GetCategoryLearnInfoFail;
      };

export const reqType = 'GetCategoryLearnInfoReq';
export const resType = 'GetCategoryLearnInfoRes';
export const apiPath = 'get-category-learn-info';
