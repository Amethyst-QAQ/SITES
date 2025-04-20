import type { Express } from 'express';
import { createApi } from '../create-api';
import type { CountPostsReq, CountPostsRes } from 'types/api/count-posts';
import { fail, succeed } from '../utils/send-res';
import { Post } from '../db/models/Post';

export const handleCountPostsApi = (app: Express) =>
    createApi<CountPostsReq, CountPostsRes>(app, '/count-posts', async (req, res) => {
        try {
            const count = await Post.count();
            succeed(res, { count });
        } catch (e) {
            fail(res);
        }
    });
