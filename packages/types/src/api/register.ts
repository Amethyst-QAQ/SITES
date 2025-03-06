export type RegisterReq = {
    username: string;
    password: string;
};

type RegisterResSuccess = {
    success: true;
};

export enum FailReason {
    EXISTS,
    UNKNOWN,
}

type RegisterResFail = {
    success: false;
    reason: FailReason;
};

export type RegisterRes = RegisterResSuccess | RegisterResFail;

export const reqType = 'RegisterReq';
export const resType = 'RegisterRes';
export const apiPath = 'register';
