import type { GENERATED_API } from './generated';
import type { UploadFileFail } from 'types/lib/upload-file-fail';
import axios from 'axios';

export const request = async <T extends keyof GENERATED_API>(path: T, req: GENERATED_API[T]['req']) => {
    const res = await axios.post(path, req);
    return res.data as GENERATED_API[T]['res'];
};

export const upload = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/upload-file', formData, {
        headers: { authorization: token },
    });
    return res.data as
        | {
              success: true;
              id: number;
              uploadedName: string;
          }
        | {
              success: false;
              reason: UploadFileFail;
          };
};
