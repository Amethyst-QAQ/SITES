import type { Express } from 'express';
import { createApi } from '../create-api';
import { CountCommentsFail, type CountCommentsReq, type CountCommentsRes } from 'types/api/count-comments';
import { failWithReason, succeed } from '../utils/send-res';
import { Post } from '../db/models/Post';
import { Comment } from '../db/models/Comment';

export const handleCountCommentsApi = (app: Express) =>
    createApi<CountCommentsReq, CountCommentsRes>(app, '/count-comments', async (req, res) => {
        try {
            const post = await Post.findByPk(req.body.postId);
            if (!post) {
                failWithReason(res, CountCommentsFail.NOT_EXISTS);
                return;
            }

            const count = await Comment.count({ where: { postId: post.id } });

            succeed(res, { count });
        } catch (e) {
            failWithReason(res, CountCommentsFail.UNKNOWN);
        }
    });
