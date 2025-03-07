import type { Request, Response } from 'express';
import type { TupleToObject } from 'types/lib/typings/tuple-to-object';
import type { UnionToTuple } from 'types/lib/typings/union-to-tuple';
import { verify } from '../user/user-list';
import { failWithReason } from './send-res';

type UnionToObject<T> = TupleToObject<UnionToTuple<T>>;
type ExtractReasonInner<T> = {
    [key in keyof UnionToObject<T>]: UnionToObject<T>[key] extends { reason: infer U } ? U : never;
};
type ExtractReason<T> = ExtractReasonInner<T>[keyof ExtractReasonInner<T>];

type Req<T> = T extends { token: string } ? Request<Record<string, any>, any, T> : never;
type Res<T> = ExtractReason<T> extends number ? Response<T> : never;

type ReasonInput<T> = {
    NOT_LOGGED_IN: ExtractReason<T>;
    UNKNOWN: ExtractReason<T>;
};

export const needLogin = async <T, U>(req: Req<T>, res: Res<U>, fail: ReasonInput<U>) => {
    try {
        const user = await verify(req.body.token);
        if (!user) {
            failWithReason(res, fail.NOT_LOGGED_IN as any);
            return undefined;
        }

        return user;
    } catch (e) {
        failWithReason(res, fail.UNKNOWN as any);
        return undefined;
    }
};
