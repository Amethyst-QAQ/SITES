export type RegisterReq = {
    username: string;
    password: string;
};

type RegisterResSuccess = {
    success: true;
};

export enum RegisterFail {
    EXISTS,
    UNKNOWN,
}

type RegisterResFail = {
    success: false;
    reason: RegisterFail;
};

export type RegisterRes = RegisterResSuccess | RegisterResFail;

export const reqType = 'RegisterReq';
export const resType = 'RegisterRes';
export const apiPath = 'register';
