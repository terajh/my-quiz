export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'short-answer'
  | 'ordering'
  | 'matching';

export type MultipleChoiceQuestion = {
  id: string;
  type: 'multiple-choice';
  section: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type TrueFalseQuestion = {
  id: string;
  type: 'true-false';
  section: string;
  prompt: string;
  correctAnswer: boolean;
  explanation: string;
};

export type TextQuestion = {
  id: string;
  type: 'fill-blank' | 'short-answer';
  section: string;
  prompt: string;
  correctAnswer: string | string[];
  explanation: string;
};

export type OrderingQuestion = {
  id: string;
  type: 'ordering';
  section: string;
  prompt: string;
  items: string[];
  correctAnswer: string[];
  explanation: string;
};

export type MatchingPair = {
  left: string;
  right: string;
};

export type MatchingQuestion = {
  id: string;
  type: 'matching';
  section: string;
  prompt: string;
  pairs: MatchingPair[];
  correctAnswer: Record<string, string>;
  explanation: string;
};

export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | TextQuestion
  | OrderingQuestion
  | MatchingQuestion;

export type QuizAnswer = string | boolean | string[] | Record<string, string>;
