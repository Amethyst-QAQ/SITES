export type GetExamInfoContentReq = {
    id: number;
};

export enum GetExamInfoContentFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type GetExamInfoContentRes =
    | {
          success: true;
          data: {
              title: string;
              content: string;
              createdAt: number;
              updatedAt: number;
          };
      }
    | {
          success: false;
          reason: GetExamInfoContentFail;
      };

export const reqType = 'GetExamInfoContentReq';
export const resType = 'GetExamInfoContentRes';
export const apiPath = 'get-exam-info-content';
