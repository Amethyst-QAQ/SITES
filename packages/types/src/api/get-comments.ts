export type GetCommentsReq = {
    postId: number;
    from: number;
    count: number;
};

export enum GetCommentsFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type CommentInList = {
    id: number;
    content: string;
};

export type GetCommentsRes =
    | {
          success: true;
          data: CommentInList[];
      }
    | {
          success: false;
          reason: GetCommentsFail;
      };

export const reqType = 'GetCommentsReq';
export const resType = 'GetCommentsRes';
export const apiPath = 'get-comments';
