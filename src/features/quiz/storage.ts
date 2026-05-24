import type { AnswerRecord } from './quiz-state';

const STORAGE_KEY_PREFIX = 'myquiz-progress';

export function loadQuizProgress(topicId: string): Record<string, AnswerRecord> {
  try {
    const rawValue = window.localStorage.getItem(getStorageKey(topicId));
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
}

export function saveQuizProgress(topicId: string, answers: Record<string, AnswerRecord>): void {
  window.localStorage.setItem(getStorageKey(topicId), JSON.stringify(answers));
}

export function clearQuizProgress(topicId: string): void {
  window.localStorage.removeItem(getStorageKey(topicId));
}

function getStorageKey(topicId: string): string {
  return `${STORAGE_KEY_PREFIX}:${topicId}`;
}
