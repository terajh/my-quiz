import { describe, expect, it } from 'vitest';
import { questions } from './questions';

describe('questions', () => {
  it('has unique IDs and complete learning metadata', () => {
    const ids = new Set(questions.map((question) => question.id));

    expect(ids.size).toBe(questions.length);
    expect(questions.length).toBeGreaterThanOrEqual(24);
    expect(questions.every((question) => question.section.length > 0)).toBe(true);
    expect(questions.every((question) => question.explanation.length > 0)).toBe(true);
  });

  it('covers all required question types', () => {
    const types = new Set(questions.map((question) => question.type));

    expect(types).toEqual(
      new Set(['multiple-choice', 'true-false', 'fill-blank', 'short-answer', 'ordering', 'matching']),
    );
  });
});
