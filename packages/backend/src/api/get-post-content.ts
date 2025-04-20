import type { Express } from 'express';
import { createApi } from '../create-api';
import { GetPostContentFail, type GetPostContentReq, type GetPostContentRes } from 'types/api/get-post-content';
import { failWithReason, succeed } from '../utils/send-res';
import { Post } from '../db/models/Post';

export const handleGetPostContentApi = (app: Express) =>
    createApi<GetPostContentReq, GetPostContentRes>(app, '/get-post-content', async (req, res) => {
        try {
            const post = await Post.findByPk(req.body.id);
            if (!post) {
                failWithReason(res, GetPostContentFail.NOT_EXISTS);
                return;
            }
            succeed(res, {
                data: {
                    title: post.title,
                    content: post.content,
                },
            });
        } catch (e) {
            failWithReason(res, GetPostContentFail.UNKNOWN);
        }
    });
