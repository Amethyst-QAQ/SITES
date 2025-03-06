import type { Express, Request, Response } from 'express';

export const createApi = <T, U>(
    app: Express,
    path: string,
    handler: (req: Request<Record<string, any>, U, T>, res: Response<U>) => void,
) => {
    app.post(path, handler);
};
