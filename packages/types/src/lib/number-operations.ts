type ArrayOfLen<T extends number, U extends any[] = []> = U['length'] extends T ? U : ArrayOfLen<T, [...U, any]>;

export type Decrease<T extends number> = ArrayOfLen<T> extends [...infer U, any] ? U['length'] : 0;

export type Increase<T extends number> = [...ArrayOfLen<T>, any]['length'];
