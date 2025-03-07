export type LoginReq = {
    username: string;
    password: string;
};

type LoginResSuccess = {
    success: true;
    id: number;
    token: string;
};

export enum LoginFail {
    NOT_EXISTS,
    PASSWORD_ERROR,
    UNKNOWN,
}

type LoginResFail = {
    success: false;
    reason: LoginFail;
};

export type LoginRes = LoginResSuccess | LoginResFail;

export const apiPath = 'login';
export const reqType = 'LoginReq';
export const resType = 'LoginRes';
