import type { Express } from 'express';
import { createApi } from '../create-api';
import type { GetPostsReq, GetPostsRes } from 'types/api/get-posts';
import { fail, succeed } from '../utils/send-res';
import { Post } from '../db/models/Post';

export const handleGetPostsApi = (app: Express) =>
    createApi<GetPostsReq, GetPostsRes>(app, '/get-posts', async (req, res) => {
        try {
            const posts = await Post.findAll({
                order: [['createdAt', 'DESC']],
                limit: req.body.count,
                offset: req.body.from,
            });
            succeed(res, { data: posts.map((p) => ({ id: p.id, title: p.title })) });
        } catch (e) {
            fail(res);
        }
    });
