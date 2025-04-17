import type { Express } from 'express';
import { createApi } from '../create-api';
import { UploadQuestionsFail, type UploadQuestionsReq, type UploadQuestionsRes } from 'types/api/upload-questions';
import { failWithReason, succeed } from '../utils/send-res';
import { needAdmin } from '../utils/need-admin';
import { Knowledge } from '../db/models/Knowledge';
import { QuestionType } from 'types/api/get-exam-questions';
import { ChoiceQuestion } from '../db/models/ChoiceQuestion';
import { Choice } from '../db/models/Choice';
import { SubjectiveQuestion } from '../db/models/SubjectiveQuestion';

export const handleUploadQuestionsApi = (app: Express) =>
    createApi<UploadQuestionsReq, UploadQuestionsRes>(app, '/upload-questions', async (req, res) => {
        try {
            const user = await needAdmin(req, res, UploadQuestionsFail);
            if (!user) {
                return;
            }

            const knowledge = await Knowledge.findByPk(req.body.knowledgeId);
            if (!knowledge) {
                failWithReason(res, UploadQuestionsFail.INVALID_DATA);
                return;
            }

            for (const question of req.body.questions) {
                if (question.type == QuestionType.CHOICE) {
                    const dbQuestion = await ChoiceQuestion.create({
                        knowledgeId: knowledge.id,
                        description: question.description,
                        answerSequenceId: question.answer,
                    });
                    await Choice.bulkCreate(
                        question.choices.map((c, i) => ({
                            questionId: dbQuestion.id,
                            sequenceId: i,
                            content: c,
                        })),
                    );
                } else {
                    await SubjectiveQuestion.create({
                        knowledgeId: knowledge.id,
                        content: question.content,
                        answer: question.answer,
                    });
                }
            }

            succeed(res);
        } catch (e) {
            failWithReason(res, UploadQuestionsFail.UNKNOWN);
        }
    });
