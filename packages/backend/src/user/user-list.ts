import { LoginFail } from 'types/api/login';
import { User } from '../db/models/User';

class UserList {
    private expireTime: number;
    private tokenMap: Map<string, { id: number; expireTime: number }>;
    private idMap: Map<number, { token: string; expireTime: number }>;
    private cleanupInterval: NodeJS.Timeout;

    constructor(expireTime: number = 30 * 60 * 1000, cleanupIntervalMs: number = 5 * 60 * 1000) {
        this.expireTime = expireTime;
        this.tokenMap = new Map();
        this.idMap = new Map();

        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredSessions();
        }, cleanupIntervalMs);
    }

    destroy() {
        clearInterval(this.cleanupInterval);
    }

    private cleanupExpiredSessions() {
        const now = Date.now();
        for (const [token, entry] of this.tokenMap) {
            if (entry.expireTime <= now) {
                this.tokenMap.delete(token);
                this.idMap.delete(entry.id);
            }
        }
    }

    add(token: string, id: number): void {
        const existingIdEntry = this.idMap.get(id);
        if (existingIdEntry) {
            this.tokenMap.delete(existingIdEntry.token);
            this.idMap.delete(id);
        }

        const existingTokenEntry = this.tokenMap.get(token);
        if (existingTokenEntry) {
            this.idMap.delete(existingTokenEntry.id);
            this.tokenMap.delete(token);
        }

        const newExpireTime = Date.now() + this.expireTime;
        this.tokenMap.set(token, { id, expireTime: newExpireTime });
        this.idMap.set(id, { token, expireTime: newExpireTime });
    }

    removeId(id: number): void {
        const entry = this.idMap.get(id);
        if (entry) {
            this.tokenMap.delete(entry.token);
            this.idMap.delete(id);
        }
    }

    removeToken(token: string): void {
        const entry = this.tokenMap.get(token);
        if (entry) {
            this.idMap.delete(entry.id);
            this.tokenMap.delete(token);
        }
    }

    getId(token: string): number | undefined {
        const entry = this.tokenMap.get(token);
        if (!entry) return undefined;

        const now = Date.now();
        if (now >= entry.expireTime) {
            this.tokenMap.delete(token);
            this.idMap.delete(entry.id);
            return undefined;
        }

        const newExpireTime = now + this.expireTime;
        entry.expireTime = newExpireTime;
        this.idMap.get(entry.id)!.expireTime = newExpireTime;
        return entry.id;
    }

    getToken(id: number): string | undefined {
        const entry = this.idMap.get(id);
        if (!entry) return undefined;

        const now = Date.now();
        if (now >= entry.expireTime) {
            this.idMap.delete(id);
            this.tokenMap.delete(entry.token);
            return undefined;
        }

        const newExpireTime = now + this.expireTime;
        entry.expireTime = newExpireTime;
        this.tokenMap.get(entry.token)!.expireTime = newExpireTime;
        return entry.token;
    }
}

const userList = new UserList();

const generateToken = () => {
    const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < 64; i++) {
        result += table[Math.floor(Math.random() * 64)];
    }
    return result;
};

export class LoginError extends Error {
    constructor(readonly reason: LoginFail) {
        super();
    }
}

export const login = async (username: string, password: string) => {
    try {
        const user = await User.findOne({ where: { username } });
        if (user) {
            if (user.password != password) {
                throw new LoginError(LoginFail.PASSWORD_ERROR);
            }

            const existingToken = userList.getToken(user.id);
            if (existingToken) {
                return { user, token: existingToken };
            }
            let token = generateToken();
            while (userList.getId(token)) {
                token = generateToken();
            }
            userList.add(token, user.id);
            return { user, token };
        }
        throw new LoginError(LoginFail.NOT_EXISTS);
    } catch (e) {
        if (e instanceof LoginError) {
            throw e;
        } else {
            throw new LoginError(LoginFail.UNKNOWN);
        }
    }
};

export const verify = async (token: string) => {
    const userId = userList.getId(token);

    const user = await User.findByPk(userId);
    if (!user) {
        userList.removeToken(token);
        return undefined;
    }

    return user;
};

export const logout = (token: string) => userList.removeToken(token);
