// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { clearQuizProgress, loadQuizProgress, saveQuizProgress } from './storage';

describe('quiz storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('stores progress separately for each topic', () => {
    saveQuizProgress('kubernetes', {
      cluster: { questionId: 'cluster', answer: 'Cluster', correct: true },
    });
    saveQuizProgress('network', {
      dns: { questionId: 'dns', answer: false, correct: false },
    });

    expect(loadQuizProgress('kubernetes')).toEqual({
      cluster: { questionId: 'cluster', answer: 'Cluster', correct: true },
    });
    expect(loadQuizProgress('network')).toEqual({
      dns: { questionId: 'dns', answer: false, correct: false },
    });
  });

  it('clears only the selected topic progress', () => {
    saveQuizProgress('kubernetes', {
      cluster: { questionId: 'cluster', answer: 'Cluster', correct: true },
    });
    saveQuizProgress('network', {
      dns: { questionId: 'dns', answer: false, correct: false },
    });

    clearQuizProgress('kubernetes');

    expect(loadQuizProgress('kubernetes')).toEqual({});
    expect(loadQuizProgress('network')).toEqual({
      dns: { questionId: 'dns', answer: false, correct: false },
    });
  });
});
