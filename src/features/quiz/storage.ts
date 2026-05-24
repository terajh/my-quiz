import type { AnswerRecord } from './quiz-state';

const STORAGE_KEY = 'kubernetes-quiz-progress';

export function loadQuizProgress(): Record<string, AnswerRecord> {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
}

export function saveQuizProgress(answers: Record<string, AnswerRecord>): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export function clearQuizProgress(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
