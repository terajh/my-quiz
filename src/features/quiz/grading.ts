import type { QuizAnswer, QuizQuestion } from './types';

export type GradeResult = {
  correct: boolean;
  normalizedAnswer: QuizAnswer;
};

export function gradeAnswer(_question: QuizQuestion, answer: QuizAnswer): GradeResult {
  const question = _question;

  if (question.type === 'multiple-choice') {
    return {
      correct: normalizeText(answer) === normalizeText(question.correctAnswer),
      normalizedAnswer: normalizeAnswer(answer),
    };
  }

  if (question.type === 'true-false') {
    return {
      correct: answer === question.correctAnswer,
      normalizedAnswer: answer,
    };
  }

  if (question.type === 'fill-blank' || question.type === 'short-answer') {
    const acceptedAnswers = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer];

    return {
      correct: acceptedAnswers.some((correctAnswer) => normalizeText(answer) === normalizeText(correctAnswer)),
      normalizedAnswer: normalizeAnswer(answer),
    };
  }

  if (question.type === 'ordering') {
    const submitted = Array.isArray(answer) ? answer : [];

    return {
      correct:
        submitted.length === question.correctAnswer.length &&
        submitted.every((item, index) => normalizeText(item) === normalizeText(question.correctAnswer[index])),
      normalizedAnswer: submitted,
    };
  }

  if (question.type === 'matching') {
    const submitted = isRecordAnswer(answer) ? answer : {};
    const expectedPairs = Object.entries(question.correctAnswer);

    return {
      correct:
        expectedPairs.length === Object.keys(submitted).length &&
        expectedPairs.every(([left, right]) => normalizeText(submitted[left]) === normalizeText(right)),
      normalizedAnswer: submitted,
    };
  }

  return {
    correct: false,
    normalizedAnswer: answer,
  };
}

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase();
}

function normalizeAnswer(answer: QuizAnswer): QuizAnswer {
  return typeof answer === 'string' ? answer.trim() : answer;
}

function isRecordAnswer(answer: QuizAnswer): answer is Record<string, string> {
  return typeof answer === 'object' && answer !== null && !Array.isArray(answer);
}
