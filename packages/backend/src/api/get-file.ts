import type { Express } from 'express';
import { createApi } from '../create-api';
import { GetFileFail, type GetFileReq, type GetFileRes } from 'types/api/get-file';
import { failWithReason, succeed } from '../utils/send-res';
import { File } from '../db/models/File';

export const handleGetFileApi = (app: Express) =>
    createApi<GetFileReq, GetFileRes>(app, '/get-file', async (req, res) => {
        try {
            const file = await File.findByPk(req.body.id);
            if (!file) {
                failWithReason(res, GetFileFail.NOT_EXISTS);
                return;
            }
            succeed(res, {
                data: {
                    name: file.name,
                    ext: file.ext ?? '',
                },
            });
        } catch (e) {
            failWithReason(res, GetFileFail.UNKNOWN);
        }
    });
