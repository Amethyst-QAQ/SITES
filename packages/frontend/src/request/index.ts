import type { GENERATED_API } from './generated';
import axios from 'axios';

export const request = async <T extends keyof GENERATED_API>(path: T, req: GENERATED_API[T]['req']) => {
    const res = axios.post(path, req);
    return (await res).data as GENERATED_API[T]['res'];
};
