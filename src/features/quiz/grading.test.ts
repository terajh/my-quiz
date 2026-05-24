import { describe, expect, it } from 'vitest';
import { gradeAnswer } from './grading';
import type { QuizQuestion } from './types';

describe('gradeAnswer', () => {
  it('grades multiple-choice answers', () => {
    const question: QuizQuestion = {
      id: 'mc',
      type: 'multiple-choice',
      section: 'Service',
      prompt: 'Service의 기본 타입은?',
      options: ['NodePort', 'ClusterIP', 'LoadBalancer', 'Ingress'],
      correctAnswer: 'ClusterIP',
      explanation: 'ClusterIP는 Service의 기본 타입이다.',
    };

    expect(gradeAnswer(question, 'ClusterIP')).toEqual({ correct: true, normalizedAnswer: 'ClusterIP' });
    expect(gradeAnswer(question, 'NodePort')).toEqual({ correct: false, normalizedAnswer: 'NodePort' });
  });

  it('grades true-false answers', () => {
    const question: QuizQuestion = {
      id: 'tf',
      type: 'true-false',
      section: 'Ingress',
      prompt: 'Ingress는 규칙이며 Controller가 실제 라우팅을 수행한다.',
      correctAnswer: true,
      explanation: 'Ingress Controller가 규칙을 실행한다.',
    };

    expect(gradeAnswer(question, true).correct).toBe(true);
    expect(gradeAnswer(question, false).correct).toBe(false);
  });

  it('grades fill-blank and short-answer text case-insensitively', () => {
    const question: QuizQuestion = {
      id: 'blank',
      type: 'fill-blank',
      section: '헬스체크',
      prompt: '준비 상태를 확인하는 Probe는?',
      correctAnswer: ['Readiness Probe', 'readiness'],
      explanation: 'Readiness Probe는 엔드포인트 포함 여부를 결정한다.',
    };

    expect(gradeAnswer(question, ' readiness probe ').correct).toBe(true);
    expect(gradeAnswer(question, 'liveness').correct).toBe(false);
  });

  it('grades ordering answers by exact sequence', () => {
    const question: QuizQuestion = {
      id: 'order',
      type: 'ordering',
      section: '트래픽 흐름',
      prompt: '외부 요청 흐름을 순서대로 배열하세요.',
      items: ['Service', 'Pod', 'Ingress'],
      correctAnswer: ['Ingress', 'Service', 'Pod'],
      explanation: '외부 요청은 Ingress, Service, Pod 순서로 전달된다.',
    };

    expect(gradeAnswer(question, ['Ingress', 'Service', 'Pod']).correct).toBe(true);
    expect(gradeAnswer(question, ['Service', 'Ingress', 'Pod']).correct).toBe(false);
  });

  it('grades matching answers regardless of object key order', () => {
    const question: QuizQuestion = {
      id: 'match',
      type: 'matching',
      section: '명령어',
      prompt: '명령어와 용도를 연결하세요.',
      pairs: [
        { left: 'kubectl get svc', right: 'Service 목록 조회' },
        { left: 'kubectl logs <pod-name>', right: '파드 로그 출력' },
      ],
      correctAnswer: {
        'kubectl get svc': 'Service 목록 조회',
        'kubectl logs <pod-name>': '파드 로그 출력',
      },
      explanation: 'get svc는 서비스 목록, logs는 파드 로그를 확인한다.',
    };

    expect(
      gradeAnswer(question, {
        'kubectl logs <pod-name>': '파드 로그 출력',
        'kubectl get svc': 'Service 목록 조회',
      }).correct,
    ).toBe(true);
    expect(
      gradeAnswer(question, {
        'kubectl get svc': '파드 로그 출력',
        'kubectl logs <pod-name>': 'Service 목록 조회',
      }).correct,
    ).toBe(false);
  });
});
