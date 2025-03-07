import type { Response } from 'express';
import type { TupleToObject } from 'types/lib/typings/tuple-to-object';
import type { UnionToTuple } from 'types/lib/typings/union-to-tuple';

type ResBody<T extends Response> = T extends Response<infer U> ? U : never;

type UnionToObject<T> = TupleToObject<UnionToTuple<T>>;

type ParseSuccessParam<T, S, O extends string> = T extends { success: S } ? Omit<T, 'success' | O> : never;

type ValueOf<T> = T[keyof T];

type ExtractSuccessParams<T> = {
    [key in keyof UnionToObject<T>]: ParseSuccessParam<UnionToObject<T>[key], true, never>;
};

type ExtractFailParams<T> = {
    [key in keyof UnionToObject<T>]: ParseSuccessParam<UnionToObject<T>[key], false, never>;
};

type ExtractReasonParams<T> = {
    [key in keyof UnionToObject<T>]: ParseSuccessParam<UnionToObject<T>[key], false, 'reason'>;
};

export const succeed = <T extends Response>(res: T, data?: ValueOf<ExtractSuccessParams<ResBody<T>>>) => {
    res.send({ success: true, ...data } as any);
};

export const fail = <T extends Response>(res: T, data?: ValueOf<ExtractFailParams<ResBody<T>>>) => {
    res.send({ success: false, ...data } as any);
};

export const failWithReason = <T extends Response>(
    res: T,
    reason: ResBody<T> extends { success: true } | { success: false; reason: infer U } ? U : never,
    data?: ValueOf<ExtractReasonParams<ResBody<T>>>,
) => {
    res.send({ success: false, reason, ...data } as any);
};
