import type { QuizAnswer, QuizQuestion, QuestionType } from './types';

export type AnswerRecord = {
  questionId: string;
  answer: QuizAnswer;
  correct: boolean;
};

export type QuizSummary = {
  total: number;
  answered: number;
  correct: number;
  incorrect: number;
  remaining: number;
  progressPercentage: number;
  scorePercentage: number;
};

export type QuizFilters = {
  section: string;
  type: QuestionType | 'all';
  incorrectOnly: boolean;
  answers: Record<string, AnswerRecord>;
};

export function buildQuizSummary(questions: QuizQuestion[], answers: Record<string, AnswerRecord>): QuizSummary {
  const total = questions.length;
  const answered = questions.filter((question) => answers[question.id]).length;
  const correct = questions.filter((question) => answers[question.id]?.correct).length;
  const incorrect = answered - correct;
  const remaining = total - answered;

  return {
    total,
    answered,
    correct,
    incorrect,
    remaining,
    progressPercentage: toPercentage(answered, total),
    scorePercentage: toPercentage(correct, answered),
  };
}

export function getVisibleQuestions(questions: QuizQuestion[], filters: QuizFilters): QuizQuestion[] {
  return questions.filter((question) => {
    const sectionMatches = filters.section === 'all' || question.section === filters.section;
    const typeMatches = filters.type === 'all' || question.type === filters.type;
    const incorrectMatches = !filters.incorrectOnly || filters.answers[question.id]?.correct === false;

    return sectionMatches && typeMatches && incorrectMatches;
  });
}

export function getAvailableSections(questions: QuizQuestion[]): string[] {
  return ['all', ...uniqueInOrder(questions.map((question) => question.section))];
}

export function getAvailableTypes(questions: QuizQuestion[]): Array<QuestionType | 'all'> {
  return ['all', ...uniqueInOrder(questions.map((question) => question.type)).sort()];
}

function uniqueInOrder<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function toPercentage(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}
