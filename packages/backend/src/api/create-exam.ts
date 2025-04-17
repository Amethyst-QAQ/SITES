import type { Express } from 'express';
import { createApi } from '../create-api';
import { CreateExamFail, type CreateExamReq, type CreateExamRes } from 'types/api/create-exam';
import { failWithReason, succeed } from '../utils/send-res';
import { needLogin } from '../utils/need-login';
import { Knowledge } from '../db/models/Knowledge';
import { ChoiceQuestion } from '../db/models/ChoiceQuestion';
import { sql } from '@sequelize/core';
import { SubjectiveQuestion } from '../db/models/SubjectiveQuestion';
import { generateToken } from '../user/user-list';
import { Exam } from '../db/models/Exam';
import { ExamChoiceQuestion } from '../db/models/ExamChoiceQuestion';
import { ExamSubjectiveQuestion } from '../db/models/ExamSubjectiveQuestion';

export const handleCreateExamApi = (app: Express) =>
    createApi<CreateExamReq, CreateExamRes>(app, '/create-exam', async (req, res) => {
        try {
            const user = await needLogin(req, res, CreateExamFail);
            if (!user) {
                return;
            }
            const knowledgeId = req.body.knowledgeId;
            if (knowledgeId) {
                const knowledge = await Knowledge.findByPk(knowledgeId);
                if (!knowledge) {
                    failWithReason(res, CreateExamFail.NOT_EXISTS);
                    return;
                }
            }

            const choiceQuestions = await ChoiceQuestion.findAll({
                where: knowledgeId ? { knowledgeId } : undefined,
                order: [sql`RANDOM()`],
                limit: 6,
            });

            const subjectiveQuestions = await SubjectiveQuestion.findAll({
                where: knowledgeId ? { knowledgeId } : undefined,
                order: [sql`RANDOM()`],
                limit: 4,
            });

            if (choiceQuestions.length == 0 && subjectiveQuestions.length == 0) {
                failWithReason(res, CreateExamFail.NO_QUESTIONS);
                return;
            }

            const examToken = await (async () => {
                let temp = generateToken();
                while (await Exam.findOne({ where: { token: temp } })) {
                    temp = generateToken();
                }
                return temp;
            })();

            const newExam = await Exam.create({ token: examToken });

            await ExamChoiceQuestion.bulkCreate(
                choiceQuestions.map((q, i) => ({
                    examId: newExam.id,
                    questionId: q.id,
                    sequenceId: i,
                })),
            );

            await ExamSubjectiveQuestion.bulkCreate(
                subjectiveQuestions.map((q, i) => ({
                    examId: newExam.id,
                    questionId: q.id,
                    sequenceId: choiceQuestions.length + i,
                })),
            );

            succeed(res, { examToken });
        } catch (e) {
            failWithReason(res, CreateExamFail.UNKNOWN);
        }
    });
