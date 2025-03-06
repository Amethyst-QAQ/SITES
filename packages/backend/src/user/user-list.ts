import { FailReason } from 'types/api/login';
import { User } from '../db/models/User';

class UserList {
    private tokenToId: Record<string, number> = {};
    private idToToken: Record<number, string> = {};
    add(token: string, id: number) {
        this.tokenToId[token] = id;
        this.idToToken[id] = token;
    }

    removeId(id: number) {
        const token = this.idToToken[id];
        delete this.tokenToId[token];
        delete this.idToToken[id];
    }

    removeToken(token: string) {
        const id = this.tokenToId[token];
        delete this.tokenToId[token];
        delete this.idToToken[id];
    }

    getId(token: string) {
        return this.tokenToId[token] as number | undefined;
    }

    getToken(id: number) {
        return this.idToToken[id] as string | undefined;
    }
}

const userList = new UserList();

const generateToken = () => {
    const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += table[Math.floor(Math.random() * 64)];
    }
    return result;
};

export class LoginError extends Error {
    constructor(readonly reason: FailReason) {
        super();
    }
}

export const login = async (username: string, password: string) => {
    try {
        const user = await User.findOne({ where: { username } });
        if (user) {
            if (user.password != password) {
                throw new LoginError(FailReason.PASSWORD_ERROR);
            }

            const existingToken = userList.getToken(user.id);
            if (existingToken) {
                return existingToken;
            }
            let token = generateToken();
            while (userList.getId(token)) {
                token = generateToken();
            }
            userList.add(token, user.id);
            return token;
        }
        throw new LoginError(FailReason.NOT_EXISTS);
    } catch (e) {
        if (e instanceof LoginError) {
            throw e;
        } else {
            throw new LoginError(FailReason.UNKNOWN);
        }
    }
};

export const verify = (token: string) => userList.getId(token);

export const logout = (token: string) => userList.removeToken(token);
