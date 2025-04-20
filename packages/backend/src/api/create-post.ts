import type { Express } from 'express';
import { createApi } from '../create-api';
import { CreatePostFail, type CreatePostReq, type CreatePostRes } from 'types/api/create-post';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { Post } from '../db/models/Post';

export const handleCreatePostApi = (app: Express) =>
    createApi<CreatePostReq, CreatePostRes>(app, '/create-post', async (req, res) => {
        try {
            const user = await needLogin(req, res, CreatePostFail);
            if (!user) {
                return;
            }
            const post = await Post.create({
                userId: user.id,
                title: req.body.title,
                content: req.body.content,
            });
            succeed(res, { id: post.id });
        } catch (e) {
            failWithReason(res, CreatePostFail.UNKNOWN);
        }
    });
