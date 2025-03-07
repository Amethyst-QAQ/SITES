export type GetFileReq = {
    id: number;
};

export type GotFile = {
    name: string;
    ext: string;
};

export enum GetFileFail {
    NOT_EXISTS,
    UNKNOWN,
}

export type GetFileRes =
    | {
          success: true;
          data: GotFile;
      }
    | {
          success: false;
          reason: GetFileFail;
      };

export const reqType = 'GetFileReq';
export const resType = 'GetFileRes';
export const apiPath = 'get-file';
