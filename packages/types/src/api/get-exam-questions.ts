export type GetExamQuestionsReq = {
    token: string;
    examToken: string;
};

export enum GetExamQuestionsFail {
    NOT_LOGGED_IN,
    NOT_EXISTS,
    ENDED,
    UNKNOWN,
}

export enum QuestionType {
    CHOICE,
    SUBJECTIVE,
}

export type ChoiceQuestionInList = {
    type: QuestionType.CHOICE;
    description: string;
    choices: string[];
};

export type SubjectiveQuestionInList = {
    type: QuestionType.SUBJECTIVE;
    description: string;
};

export type GetExamQuestionsRes =
    | {
          success: true;
          data: {
              startedAt: number;
              questions: (ChoiceQuestionInList | SubjectiveQuestionInList)[];
          };
      }
    | {
          success: false;
          reason: GetExamQuestionsFail;
      };

export const reqType = 'GetExamQuestionsReq';
export const resType = 'GetExamQuestionsRes';
export const apiPath = 'get-exam-questions';
