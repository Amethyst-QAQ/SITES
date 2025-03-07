import fs from 'fs';
import path from 'path';
import type { Express } from 'express';
import multer from 'multer';
import { File } from './db/models/File';

const uploadPath = path.resolve(__dirname, '../../../data/uploaded_files');

export const createUploadApi = (app: Express) => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: `${uploadPath}/`,
        filename: (req, file, callback) => {
            req.body.clientName = file.originalname;
            const ext = path.extname(file.originalname);
            (async () => {
                const model = await File.create({ name: file.originalname, ext: ext == '' ? null : ext });
                req.body.dbId = model.id;
                return model.id.toString() + ext;
            })().then((n) => callback(null, n));
        },
    });

    const upload = multer({ storage });

    app.post('/upload-file', upload.single('file'), (req, res) => {
        res.send({ success: true, id: req.body.dbId });
    });
};
