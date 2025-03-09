import type { Express } from 'express';
import { createApi } from '../create-api';
import { LearnFail, type LearnReq, type LearnRes } from 'types/api/learn';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { KnowledgeItem } from '../db/models/KnowledgeItem';
import { LearnRecord } from '../db/models/LearnRecord';

export const handleLearnApi = (app: Express) =>
    createApi<LearnReq, LearnRes>(app, '/learn', async (req, res) => {
        try {
            const user = await needLogin(req, res, LearnFail);
            if (!user) {
                return;
            }

            const item = await KnowledgeItem.findByPk(req.body.id);
            if (!item) {
                failWithReason(res, LearnFail.NOT_EXISTS);
                return;
            }

            const record = await LearnRecord.findOne({ where: { knowledgeItemId: req.body.id, userId: user.id } });
            if (!record) {
                await LearnRecord.create({ knowledgeItemId: req.body.id, userId: user.id, date: new Date() });
            } else {
                await record.update({ date: new Date() });
            }

            succeed(res);
        } catch (e) {
            failWithReason(res, LearnFail.UNKNOWN);
        }
    });
