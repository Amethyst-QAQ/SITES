import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetKnowledgeItemContentFail,
    type GetKnowledgeItemContentReq,
    type GetKnowledgeItemContentRes,
} from 'types/api/get-knowledge-item-content';
import { failWithReason, succeed } from '../utils/send-res';
import { KnowledgeItem } from '../db/models/KnowledgeItem';

export const handleGetKnowledgeItemContentApi = (app: Express) =>
    createApi<GetKnowledgeItemContentReq, GetKnowledgeItemContentRes>(
        app,
        '/get-knowledge-item-content',
        async (req, res) => {
            try {
                const item = await KnowledgeItem.findByPk(req.body.id);
                if (!item) {
                    failWithReason(res, GetKnowledgeItemContentFail.NOT_EXISTS);
                    return;
                }

                succeed(res, {
                    data: {
                        title: item.title,
                        content: item.content,
                    },
                });
            } catch (e) {
                failWithReason(res, GetKnowledgeItemContentFail.UNKNOWN);
            }
        },
    );
