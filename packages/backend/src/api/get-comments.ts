import type { Express } from 'express';
import { createApi } from '../create-api';
import { GetCommentsFail, type GetCommentsReq, type GetCommentsRes } from 'types/api/get-comments';
import { failWithReason, succeed } from '../utils/send-res';
import { Post } from '../db/models/Post';
import { Comment } from '../db/models/Comment';

export const handleGetCommentsApi = (app: Express) =>
    createApi<GetCommentsReq, GetCommentsRes>(app, '/get-comments', async (req, res) => {
        try {
            const post = await Post.findByPk(req.body.postId);
            if (!post) {
                failWithReason(res, GetCommentsFail.NOT_EXISTS);
                return;
            }
            const comments = await Comment.findAll({
                where: { postId: post.id },
                order: [['createdAt', 'DESC']],
                limit: req.body.count,
                offset: req.body.from,
            });
            succeed(res, { data: comments.map((c) => ({ id: c.id, content: c.content })) });
        } catch (e) {
            failWithReason(res, GetCommentsFail.UNKNOWN);
        }
    });
