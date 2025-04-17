import type { ChoiceQuestionInList, QuestionType, SubjectiveQuestionInList } from './get-exam-questions';

export type GetExamResultReq = {
    token: string;
    examToken: string;
};

export enum GetExamResultFail {
    NOT_LOGGED_IN,
    NOT_EXISTS,
    NO_ANSWER,
    UNKNOWN,
}

export type ChoiceQuestionResult = {
    type: QuestionType.CHOICE;
    question: Omit<ChoiceQuestionInList, 'type'>;
    myAnswer: number;
    answer: number;
};

export type SubjectiveQuestionResult = {
    type: QuestionType.SUBJECTIVE;
    question: Omit<SubjectiveQuestionInList, 'type'>;
    myAnswer: string;
    answer: string;
};

export type GetExamResultRes =
    | {
          success: true;
          data: (ChoiceQuestionResult | SubjectiveQuestionResult)[];
      }
    | {
          success: false;
          reason: GetExamResultFail;
      };

export const reqType = 'GetExamResultReq';
export const resType = 'GetExamResultRes';
export const apiPath = 'get-exam-result';
