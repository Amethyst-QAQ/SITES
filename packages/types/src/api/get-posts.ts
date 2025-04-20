export type GetPostsReq = {
    count: number;
    from: number;
};

export type PostInList = { id: number; title: string; content: string };

export type GetPostsRes =
    | {
          success: true;
          data: PostInList[];
      }
    | {
          success: false;
      };

export const reqType = 'GetPostsReq';
export const resType = 'GetPostsRes';
export const apiPath = 'get-posts';
