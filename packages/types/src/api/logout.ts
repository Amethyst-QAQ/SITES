export type LogoutReq = {
    token: string;
};

export type LogoutRes = {
    success: boolean;
};

export const reqType = 'LogoutReq';
export const resType = 'LogoutRes';
export const apiPath = 'logout';
