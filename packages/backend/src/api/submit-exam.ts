import type { Express } from 'express';
import { createApi } from '../create-api';
import { SubmitExamFail, type SubmitExamReq, type SubmitExamRes } from 'types/api/submit-exam';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { Exam } from '../db/models/Exam';
import { ExamAnswer } from '../db/models/ExamAnswer';
import { ChoiceAnswer } from '../db/models/ChoiceAnswer';
import { SubjectiveAnswer } from '../db/models/SubjectiveAnswer';

export const handleSubmitExamApi = (app: Express) =>
    createApi<SubmitExamReq, SubmitExamRes>(app, '/submit-exam', async (req, res) => {
        try {
            const user = await needLogin(req, res, SubmitExamFail);
            if (!user) {
                return;
            }

            const exam = await Exam.findOne({
                where: { token: req.body.examToken },
                include: [
                    {
                        association: 'choiceQuestions',
                        include: {
                            association: 'question',
                        },
                        order: ['sequenceId'],
                    },
                    {
                        association: 'subjectiveQuestions',
                        include: {
                            association: 'question',
                        },
                        order: ['sequenceId'],
                    },
                ],
            });
            if (!exam) {
                failWithReason(res, SubmitExamFail.WRONG_DATA);
                return;
            }

            for (let i = 0; i < exam.choiceQuestions!.length; i++) {
                const userAnswer = req.body.answers[i];
                if (typeof userAnswer != 'number') {
                    failWithReason(res, SubmitExamFail.WRONG_DATA);
                    return;
                }
            }

            for (let i = 0; i < exam.subjectiveQuestions!.length; i++) {
                const userAnswer = req.body.answers[i + exam.choiceQuestions!.length];
                if (typeof userAnswer != 'string') {
                    failWithReason(res, SubmitExamFail.WRONG_DATA);
                    return;
                }
            }

            const examAnswer = await ExamAnswer.create({ examId: exam.id, userId: user.id });

            await ChoiceAnswer.bulkCreate(
                req.body.answers
                    .filter((_, i) => i < exam.choiceQuestions!.length)
                    .map((v, i) => {
                        const value = v as number;
                        return {
                            questionId: exam.choiceQuestions![i].question!.id,
                            answerId: examAnswer.id,
                            answerSequenceId: value,
                        };
                    }),
            );

            await SubjectiveAnswer.bulkCreate(
                req.body.answers
                    .filter((_, i) => i >= exam.choiceQuestions!.length)
                    .map((v, i) => {
                        const value = v as string;
                        return {
                            questionId: exam.subjectiveQuestions![i].question!.id,
                            answerId: examAnswer.id,
                            answer: value,
                        };
                    }),
            );

            succeed(res);
        } catch (e) {
            failWithReason(res, SubmitExamFail.UNKNOWN);
        }
    });
