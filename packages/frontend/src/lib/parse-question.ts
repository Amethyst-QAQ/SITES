import { QuestionType } from 'types/api/get-exam-questions';
import yaml from 'yaml';

type FrontMatter =
    | {
          type: 'choice';
          answer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
      }
    | {
          type: 'subjective';
      };

const checkFrontMatter = (frontMatter: Record<string, any>): frontMatter is FrontMatter => {
    if ('type' in frontMatter) {
        if (frontMatter.type == 'choice') {
            return (
                typeof frontMatter.answer == 'string' &&
                'ABCDEFGH'.includes(frontMatter.answer) &&
                frontMatter.answer.length == 1
            );
        }
        return frontMatter.type == 'subjective';
    }
    return false;
};

const parseFrontMatter = (content: string) => {
    const hasFrontMatter = /^\s*---\s*(.+?)\s*---\s*(.+)$/s.exec(content);
    if (!hasFrontMatter) {
        throw new Error();
    }
    const frontMatter = yaml.parse(hasFrontMatter[1]);
    if (!checkFrontMatter(frontMatter)) {
        throw new Error();
    }
    return { frontMatter, content: hasFrontMatter[2] };
};

const parseChoiceQuestion = (content: string) => {
    const splitted = content.replaceAll(/# \[choice\][^\S\n]*\n/g, '# [choice]\n').split('# [choice]\n');
    if (splitted.length < 2) {
        throw new Error();
    }

    const description = splitted.shift();

    return { description, choices: splitted };
};

const parseSubjectiveQuestion = (content: string) => {
    const parsed = /^(.*)(?<=\n)# \[answer\][^\S\n]*\n(.*)$/s.exec(content);
    if (!parsed) {
        throw new Error();
    }
    return { content: parsed[1], answer: parsed[2] };
};

export const parseQuestion = (raw: string) => {
    const { frontMatter, content } = parseFrontMatter(raw);
    if (frontMatter.type == 'choice') {
        return {
            type: QuestionType.CHOICE,
            ...parseChoiceQuestion(content),
            answer: frontMatter.answer.charCodeAt(0) - 'A'.charCodeAt(0),
        };
    } else {
        return {
            type: QuestionType.SUBJECTIVE,
            ...parseSubjectiveQuestion(content),
        };
    }
};
