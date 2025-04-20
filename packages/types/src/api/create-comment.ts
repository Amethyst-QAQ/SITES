export type CreateCommentReq = {
    token: string;
    postId: number;
    content: string;
    parentId?: number;
};

export enum CreateCommentFail {
    NOT_LOGGED_IN,
    POST_NOT_EXISTS,
    PARENT_NOT_EXISTS,
    UNKNOWN,
}

export type CreateCommentRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: CreateCommentFail;
      };

export const reqType = 'CreateCommentReq';
export const resType = 'CreateCommentRes';
export const apiPath = 'create-comment';
