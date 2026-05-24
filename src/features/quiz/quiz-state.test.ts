import { describe, expect, it } from 'vitest';
import {
  buildQuizSummary,
  getAvailableSections,
  getAvailableTypes,
  getVisibleQuestions,
  type AnswerRecord,
} from './quiz-state';
import type { QuizQuestion } from './types';

const sampleQuestions: QuizQuestion[] = [
  {
    id: 'cluster',
    type: 'multiple-choice',
    section: '기본 구조',
    prompt: '클러스터란?',
    options: ['노드 집합', '단일 컨테이너'],
    correctAnswer: '노드 집합',
    explanation: '클러스터는 노드 집합이다.',
  },
  {
    id: 'service',
    type: 'true-false',
    section: 'Service',
    prompt: 'Service는 고정 접근 지점을 제공한다.',
    correctAnswer: true,
    explanation: 'Service는 고정 IP/DNS를 제공한다.',
  },
  {
    id: 'ingress',
    type: 'fill-blank',
    section: 'Ingress',
    prompt: '도메인 라우팅 리소스는?',
    correctAnswer: 'Ingress',
    explanation: 'Ingress가 도메인과 경로 라우팅을 맡는다.',
  },
];

const answers: Record<string, AnswerRecord> = {
  cluster: { questionId: 'cluster', correct: true, answer: '노드 집합' },
  service: { questionId: 'service', correct: false, answer: false },
};

describe('quiz-state', () => {
  it('builds score and progress summary', () => {
    expect(buildQuizSummary(sampleQuestions, answers)).toEqual({
      total: 3,
      answered: 2,
      correct: 1,
      incorrect: 1,
      remaining: 1,
      progressPercentage: 67,
      scorePercentage: 50,
    });
  });

  it('filters questions by section and type', () => {
    expect(
      getVisibleQuestions(sampleQuestions, {
        section: 'Service',
        type: 'true-false',
        incorrectOnly: false,
        answers,
      }).map((question) => question.id),
    ).toEqual(['service']);
  });

  it('filters incorrect questions only', () => {
    expect(
      getVisibleQuestions(sampleQuestions, {
        section: 'all',
        type: 'all',
        incorrectOnly: true,
        answers,
      }).map((question) => question.id),
    ).toEqual(['service']);
  });

  it('returns available sections and types with all first', () => {
    expect(getAvailableSections(sampleQuestions)).toEqual(['all', '기본 구조', 'Service', 'Ingress']);
    expect(getAvailableTypes(sampleQuestions)).toEqual(['all', 'fill-blank', 'multiple-choice', 'true-false']);
  });
});
