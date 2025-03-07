export type GetExamInfoCategoriesReq = object;

export type ExamInfoCategory = {
    id: number;
    name: string;
};

export type GetExamInfoCategoriesRes =
    | {
          success: true;
          data: ExamInfoCategory[];
      }
    | {
          success: false;
      };

export const reqType = 'GetExamInfoCategoriesReq';
export const resType = 'GetExamInfoCategoriesRes';
export const apiPath = 'get-exam-info-categories';
