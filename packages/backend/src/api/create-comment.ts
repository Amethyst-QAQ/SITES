import type { Express } from 'express';
import { createApi } from '../create-api';
import { CreateCommentFail, type CreateCommentReq, type CreateCommentRes } from 'types/api/create-comment';
import { failWithReason } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { Post } from '../db/models/Post';
import { Comment } from '../db/models/Comment';

export const handleCreateCommentApi = (app: Express) =>
    createApi<CreateCommentReq, CreateCommentRes>(app, '/create-comment', async (req, res) => {
        try {
            const user = await needLogin(req, res, CreateCommentFail);
            if (!user) {
                return;
            }

            const post = await Post.findByPk(req.body.postId);
            if (!post) {
                failWithReason(res, CreateCommentFail.POST_NOT_EXISTS);
                return;
            }

            if (req.body.parentId) {
                const parent = await Comment.findByPk(req.body.parentId);
                if (!parent) {
                    failWithReason(res, CreateCommentFail.PARENT_NOT_EXISTS);
                    return;
                }
                await Comment.create({
                    userId: user.id,
                    content: req.body.content,
                    postId: post.id,
                    parentId: parent.id,
                });
                return;
            }

            await Comment.create({
                userId: user.id,
                content: req.body.content,
                postId: post.id,
            });
        } catch (e) {
            failWithReason(res, CreateCommentFail.UNKNOWN);
        }
    });
