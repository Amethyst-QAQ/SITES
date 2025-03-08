import type { GetCategoryLearnInfoFail, GetCategoryLearnInfoReq } from './get-category-learn-info';

export type GetItemLearnInfoReq = GetCategoryLearnInfoReq;

export type GetItemLearnInfoRes =
    | {
          success: true;
          learned: boolean;
      }
    | {
          success: false;
          reason: GetCategoryLearnInfoFail;
      };

export const reqType = 'GetItemLearnInfoReq';
export const resType = 'GetItemLearnInfoRes';
export const apiPath = 'get-item-learn-info';
