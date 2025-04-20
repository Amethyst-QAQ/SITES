export type CountPostsReq = object;
export type CountPostsRes =
    | {
          success: true;
          count: number;
      }
    | {
          success: false;
      };

export const reqType = 'CountPostsReq';
export const resType = 'CountPostsRes';
export const apiPath = 'count-posts';
