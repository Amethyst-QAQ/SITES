export type CountCommentsReq = {
    postId: number;
};

export enum CountCommentsFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type CountCommentsRes =
    | {
          success: true;
          count: number;
      }
    | {
          success: false;
          reason: CountCommentsFail;
      };

export const reqType = 'CountCommentsReq';
export const resType = 'CountCommentsRes';
export const apiPath = 'count-comments';
