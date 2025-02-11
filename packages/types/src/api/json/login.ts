export type LoginReq = {
    username: string;
    password: string;
};

type LoginResSuccess = {
    success: true;
    token: string;
};

export enum FailReason {
    NOT_EXISTS,
    PASSWORD_ERROR,
    UNKNOWN,
}

type LoginResFail = {
    success: false;
    reason: FailReason;
};

export type LoginRes = LoginResSuccess | LoginResFail;

export const apiPath = 'login';
export const reqType = 'LoginReq';
export const resType = 'LoginRes';
