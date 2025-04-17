import type { Express } from 'express';
import { createApi } from '../create-api';
import {
    GetExamQuestionsFail,
    QuestionType,
    type GetExamQuestionsReq,
    type GetExamQuestionsRes,
} from 'types/api/get-exam-questions';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { Exam } from '../db/models/Exam';

export const handleGetExamQuestionsApi = (app: Express) =>
    createApi<GetExamQuestionsReq, GetExamQuestionsRes>(app, '/get-exam-questions', async (req, res) => {
        try {
            const user = await needLogin(req, res, GetExamQuestionsFail);
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
                            include: {
                                association: 'choices',
                                order: ['sequenceId'],
                            },
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
                failWithReason(res, GetExamQuestionsFail.NOT_EXISTS);
                return;
            }

            succeed(res, {
                data: {
                    startedAt: 0, //TODO
                    questions: [
                        ...exam.choiceQuestions!.map((q) => ({
                            type: QuestionType.CHOICE,
                            description: q.question!.description,
                            choices: q.question!.choices!.map((c) => c.content),
                        })),
                        ...exam.subjectiveQuestions!.map((q) => ({
                            type: QuestionType.SUBJECTIVE,
                            description: q.question!.content,
                        })),
                    ] as any,
                },
            });
        } catch (e) {
            failWithReason(res, GetExamQuestionsFail.UNKNOWN);
        }
    });
