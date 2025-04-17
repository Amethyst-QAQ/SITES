import type { QuestionType } from './get-exam-questions';

export type ChoiceQuestion = {
    type: QuestionType.CHOICE;
    description: string;
    choices: string[];
    answer: number;
};

export type SubjectiveQuestion = {
    type: QuestionType.SUBJECTIVE;
    content: string;
    answer: string;
};

export type UploadQuestionsReq = {
    token: string;
    knowledgeId: number;
    questions: (ChoiceQuestion | SubjectiveQuestion)[];
};

export enum UploadQuestionsFail {
    NOT_LOGGED_IN,
    NO_PERMISSION,
    INVALID_DATA,
    UNKNOWN,
}

export type UploadQuestionsRes =
    | {
          success: true;
      }
    | {
          success: false;
          reason: UploadQuestionsFail;
      };

export const reqType = 'UploadQuestionsReq';
export const resType = 'UploadQuestionsRes';
export const apiPath = 'upload-questions';
