import { questions } from './questions';
import type { QuizTopic } from './types';

export const quizTopics: QuizTopic[] = [
  {
    id: 'kubernetes',
    title: '쿠버네티스 퀴즈',
    description: '클러스터 구조, 배포 흐름, Service, Ingress, 헬스체크와 운영 명령어를 점검합니다.',
    sourceLabel: 'Notion 개발 > 쿠버네티스',
    questions,
  },
];
