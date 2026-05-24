import { describe, expect, it } from 'vitest';
import { quizTopics } from './quiz-topics';

describe('quizTopics', () => {
  it('has unique topic IDs and complete topic metadata', () => {
    const ids = new Set(quizTopics.map((topic) => topic.id));

    expect(ids.size).toBe(quizTopics.length);
    expect(quizTopics.length).toBeGreaterThanOrEqual(1);
    expect(quizTopics.every((topic) => topic.title.length > 0)).toBe(true);
    expect(quizTopics.every((topic) => topic.description.length > 0)).toBe(true);
    expect(quizTopics.every((topic) => topic.sourceLabel.length > 0)).toBe(true);
    expect(quizTopics.every((topic) => topic.questions.length > 0)).toBe(true);
  });

  it('keeps the Kubernetes quiz as the first topic', () => {
    const [topic] = quizTopics;

    expect(topic.id).toBe('kubernetes');
    expect(topic.title).toBe('쿠버네티스 퀴즈');
    expect(topic.sourceLabel).toBe('Notion 개발 > 쿠버네티스');
    expect(topic.questions.length).toBeGreaterThanOrEqual(24);
  });
});
