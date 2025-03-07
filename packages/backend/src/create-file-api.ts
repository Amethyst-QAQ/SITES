import fs from 'fs';
import path from 'path';
import express from 'express';
import type { Express } from 'express';
import multer from 'multer';
import { File } from './db/models/File';
import { verify } from './user/user-list';
import { UploadFileFail } from 'types/lib/upload-file-fail';

const uploadPath = path.resolve(__dirname, '../../../data/uploaded_files');

export const createFileApi = (app: Express) => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: `${uploadPath}/`,
        filename: (req, file, callback) => {
            const uploadMetadata: Record<string, any> = {};
            (req as any).uploadMetadata = uploadMetadata;
            uploadMetadata.clientName = file.originalname;
            const ext = path.extname(file.originalname);
            (async () => {
                const model = await File.create({ name: file.originalname, ext: ext == '' ? null : ext });
                uploadMetadata.dbId = model.id;
                const uploadedName = model.id.toString() + ext;
                uploadMetadata.uploadedName = uploadedName;
                return uploadedName;
            })().then((n) => callback(null, n));
        },
    });

    const upload = multer({ storage });

    app.post(
        '/upload-file',
        async (req, res, next) => {
            try {
                const token = req.headers['authorization'];
                if (typeof token != 'string') {
                    res.json({ success: false, reason: UploadFileFail.NOT_LOGGED_IN });
                    return;
                }
                const user = await verify(token);
                if (!user) {
                    res.json({ success: false, reason: UploadFileFail.NOT_LOGGED_IN });
                    return;
                }
                next();
            } catch (e) {
                res.json({ success: false, reason: UploadFileFail.UNKNOWN });
            }
        },
        upload.single('file'),
        (req, res) => {
            const uploadMetadata = (req as any).uploadMetadata;
            res.json({ success: true, id: uploadMetadata.dbId, uploadedName: uploadMetadata.uploadedName });
        },
    );

    app.use('/files', express.static(uploadPath));
};
