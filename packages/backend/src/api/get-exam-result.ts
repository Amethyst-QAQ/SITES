import type { Express } from 'express';
import { createApi } from '../create-api';
import { GetExamResultFail, type GetExamResultReq, type GetExamResultRes } from 'types/api/get-exam-result';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { Exam } from '../db/models/Exam';
import { ExamAnswer } from '../db/models/ExamAnswer';
import { QuestionType } from 'types/api/get-exam-questions';

export const handleGetExamResultApi = (app: Express) =>
    createApi<GetExamResultReq, GetExamResultRes>(app, '/get-exam-result', async (req, res) => {
        try {
            const user = await needLogin(req, res, GetExamResultFail);
            if (!user) {
                return;
            }

            const exam = await Exam.findOne({
                where: { token: req.body.examToken },
                include: [
                    {
                        association: 'choiceQuestions',
                        order: ['sequenceId'],
                    },
                    {
                        association: 'subjectiveQuestions',
                        order: ['sequenceId'],
                    },
                ],
            });
            if (!exam) {
                failWithReason(res, GetExamResultFail.NOT_EXISTS);
                return;
            }

            const answer = await ExamAnswer.findOne({
                where: {
                    examId: exam.id,
                    userId: user.id,
                },
                include: [
                    {
                        association: 'choiceAnswers',
                        include: {
                            association: 'question',
                            include: {
                                association: 'choices',
                                order: ['sequenceId'],
                            },
                        },
                    },
                    {
                        association: 'subjectiveAnswers',
                        include: {
                            association: 'question',
                        },
                    },
                ],
            });

            if (!answer) {
                failWithReason(res, GetExamResultFail.NO_ANSWER);
                return;
            }

            succeed(res, {
                data: [
                    ...exam.choiceQuestions!.map((q) => {
                        const question = q.question!;
                        const qAnswerList = answer.choiceAnswers!.filter((a) => a.questionId == question.id);
                        if (qAnswerList.length == 0) {
                            throw new Error();
                        }
                        const qAnswer = qAnswerList[0];
                        return {
                            type: QuestionType.CHOICE,
                            question: {
                                description: question.description,
                                choices: question.choices!.map((c) => c.content),
                            },
                            myAnswer: qAnswer.answerSequenceId,
                            answer: question.answerSequenceId,
                        };
                    }),
                    ...exam.subjectiveQuestions!.map((q) => {
                        const question = q.question!;
                        const qAnswerList = answer.subjectiveAnswers!.filter((a) => a.questionId == question.id);
                        if (qAnswerList.length == 0) {
                            throw new Error();
                        }
                        const qAnswer = qAnswerList[0];
                        return {
                            type: QuestionType.SUBJECTIVE,
                            question: {
                                description: question.content,
                            },
                            myAnswer: qAnswer.answer,
                            answer: question.answer,
                        };
                    }),
                ] as any,
            });
        } catch (e) {
            failWithReason(res, GetExamResultFail.UNKNOWN);
        }
    });
