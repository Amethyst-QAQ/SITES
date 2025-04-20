export type CreatePostReq = {
    token: string;
    title: string;
    content: string;
};

export enum CreatePostFail {
    NOT_LOGGED_IN,
    UNKNOWN,
}

export type CreatePostRes =
    | {
          success: true;
          id: number;
      }
    | {
          success: false;
          reason: CreatePostFail;
      };

export const reqType = 'CreatePostReq';
export const resType = 'CreatePostRes';
export const apiPath = 'create-post';
