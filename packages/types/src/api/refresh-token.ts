export type RefreshTokenReq = {
    token: string;
};

export type RefreshTokenRes = {
    success: boolean;
};

export const reqType = 'RefreshTokenReq';
export const resType = 'RefreshTokenRes';
export const apiPath = 'refresh-token';
