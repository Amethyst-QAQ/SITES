export type GetPostContentReq = {
    id: number;
};

export enum GetPostContentFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type PostContent = {
    title: string;
    content: string;
};

export type GetPostContentRes =
    | {
          success: true;
          data: PostContent;
      }
    | {
          success: false;
          reason: GetPostContentFail;
      };

export const reqType = 'GetPostContentReq';
export const resType = 'GetPostContentRes';
export const apiPath = 'get-post-content';
